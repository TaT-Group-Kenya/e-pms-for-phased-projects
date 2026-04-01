<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectProgressUpdate;
use App\Models\CustInvoice;
use App\Models\CustPaymentAllocation;
use App\Models\CompanyInvoice;
use App\Models\CompanyPayment;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Quotation;
use Carbon\Carbon;

class DashboardInformationService
{
    public function __construct(
        protected ProjectService $projectService,
        protected ProjectProgressUpdateService $projectProgressUpdateService,
        protected OrderService $orderService,
        protected CustInvoiceService $custInvoiceService,
        protected CompanyPaymentService $companyPaymentService,
        protected CustomerService $customerService,
        protected QuotationService $quotationService,
        protected CurrencyConversionService $currencyConversionService,
    ) {
    }

    public function getProjectsOverview(string $range = 'last_6_months'): array
    {
        $now = Carbon::now();

        // Derive the current period from the requested range
        [$currentStart, $currentEnd] = $this->resolveRange($range);

        if (!$currentStart || !$currentEnd) {
            // Fallback to a sensible default if range is unsupported
            $currentStart = $now->copy()->subMonths(5)->startOfMonth();
            $currentEnd = $now->copy()->endOfMonth();
        }

        if ($currentStart->greaterThan($currentEnd)) {
            [$currentStart, $currentEnd] = [$currentEnd, $currentStart];
        }

        // Compute a previous period of the same length immediately before the current period
        $days = $currentStart->diffInDays($currentEnd) + 1;
        $previousEnd = $currentStart->copy()->subDay();
        $previousStart = $previousEnd->copy()->subDays($days - 1);

        // Load all projects (both active and deleted) for the two periods so we
        // can derive consistent totals and status-based counts.
        $currentAll = Project::whereBetween('created_at', [$currentStart, $currentEnd])->get();
        $previousAll = Project::whereBetween('created_at', [$previousStart, $previousEnd])->get();
        $currentAllOrders = Order::whereBetween('created_at', [$currentStart, $currentEnd])->where('is_deleted', 0)->count();
        $previousAllOrders = Order::whereBetween('created_at', [$previousStart, $previousEnd])->where('is_deleted', 0)->count();

        // Active projects are simply those that are not deleted.
        $currentActive = $currentAll->where('is_deleted', 0);
        $previousActive = $previousAll->where('is_deleted', 0);

        $deletedCurrent = $currentAll->where('is_deleted', 1);
        $deletedPrevious = $previousAll->where('is_deleted', 1);

        // Project status enum: ['new', 'progress', 'draft', 'complete']
        // Finished projects are completed and not deleted.
        $currentFinishedCount = $currentActive->where('status', 'complete')->count();
        $previousFinishedCount = $previousActive->where('status', 'complete')->count();

        return [
            // Total projects includes both active and deleted for the period.
            'total_projects' => $this->buildCountWithDelta($currentAll->count(), $previousAll->count()),
            'active_projects' => $this->buildCountWithDelta(
                $currentActive->count(),
                $previousActive->count(),
            ),
            'finished_projects' => $this->buildCountWithDelta(
                $currentFinishedCount,
                $previousFinishedCount,
            ),
            'orders_count' => $this->buildCountWithDelta(
                $currentAllOrders,
                $previousAllOrders,
            ),
        ];
    }

    public function getProjectsRoadmap(string $range = 'this_week'): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = Project::query()->where('is_deleted', 0);
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $projects = $query->orderByDesc('created_at')->limit(7)->get(['id', 'job_reference_id', 'name', 'progress']);

        return $projects->map(function (Project $project) {
            return [
                'id' => $project->id,
                'job_reference_id' => $project->job_reference_id,
                'name' => $project->name,
                'progress' => (float) ($project->progress ?? 0),
            ];
        })->all();
    }

    public function getProjectsProgressOverview(string $range = 'last_6_months'): array
    {
        $now = Carbon::now();

        [$start, $end] = $this->resolveRange($range);

        if (!$start || !$end) {
            $start = $now->copy()->subMonths(5)->startOfMonth();
            $end = $now->copy()->endOfMonth();
        }

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end, $start];
        }

        $projects = Project::where('is_deleted', 0)
            ->whereBetween('created_at', [$start, $end])
            ->get(['id', 'status']);

        return [
            'new' => $projects->where('status', 'new')->count(),
            'progress' => $projects->where('status', 'progress')->count(),
            'draft' => $projects->where('status', 'draft')->count(),
            'complete' => $projects->where('status', 'complete')->count(),
        ];
    }

    public function getRecentProgressUpdates(int $limit = 10): array
    {
        $updates = ProjectProgressUpdate::with(['project', 'projectPhase'])
            ->where('is_deleted', 0)
            ->orderByDesc('updated_at')
            ->limit($limit)
            ->get();

        return $updates->map(function (ProjectProgressUpdate $update) {
            return [
                'id' => $update->id,
                'project_id' => $update->project_id,
                'job_reference_id' => $update->project?->job_reference_id,
                'project_name' => $update->project?->name,
                'phase_name' => $update->projectPhase?->name,
                'comment' => $update->comment,
                'percentage_complete' => (float) ($update->percentage_complete ?? 0),
                'updated_at' => $update->updated_at,
            ];
        })->all();
    }

    public function getLatestProjects(int $limit = 20): array
    {
        $projects = Project::with(['customer'])
            ->where('is_deleted', 0)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        return $projects->map(function (Project $project) {
            return [
                'id' => $project->id,
                'code' => $project->code,
                'name' => $project->name,
                'customer_name' => $project->customer?->name,
                'budget_estimate' => (float) ($project->budget_estimate ?? 0),
                'currency' => $project->currency,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status,
            ];
        })->all();
    }

    public function getProjectsAnalysis(string $range = 'last_7_days'): array
    {
        $now = Carbon::now();

        // For projects analysis we always work with full calendar months.
        // Ignore highly granular ranges (day/week/7 days) and normalise them
        // to a sensible month-based window.
        $monthRange = match ($range) {
            'this_month', 'this_year', 'last_6_months' => $range,
            default => 'last_6_months',
        };

        [$start, $end] = $this->resolveRange($monthRange);

        if (!$start || !$end) {
            // Fallback to last 6 months when something unexpected is passed in.
            $start = $now->copy()->subMonths(5)->startOfMonth();
            $end = $now->copy()->endOfMonth();
        }

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end, $start];
        }

        // Build month buckets between start and end (max 24 to avoid runaway loops)
        $months = [];
        $cursor = $start->copy()->startOfMonth();
        $endMonth = $end->copy()->endOfMonth();
        $safety = 24;

        while ($cursor->lessThanOrEqualTo($endMonth) && $safety-- > 0) {
            $months[] = [
                'key' => $cursor->format('Y-m'),
                'label' => $cursor->format('M y'),
            ];
            $cursor->addMonth();
        }

        // If for some reason we couldn't build any months, fall back to the last 6 months.
        if (empty($months)) {
            $months = [];
            for ($i = 5; $i >= 0; $i--) {
                $month = $now->copy()->subMonths($i);
                $months[] = [
                    'key' => $month->format('Y-m'),
                    'label' => $month->format('M y'),
                ];
            }
            $start = $now->copy()->subMonths(5)->startOfMonth();
            $end = $now->copy()->endOfMonth();
        }

        $projects = Project::where('is_deleted', 0)
            ->whereBetween('created_at', [$start, $end])
            ->get(['budget_estimate', 'currency', 'created_at']);

        $companyPayments = CompanyPayment::where('is_deleted', 0)
            ->whereBetween('payment_date', [$start, $end])
            ->get(['net_amount', 'currency', 'payment_date']);

        $custInvoices = CustInvoice::where('is_deleted', 0)
            ->whereBetween('created_at', [$start, $end])
            ->get(['total_amount', 'currency', 'created_at']);

        // Prepare per-month buckets keyed by 'Y-m'.
        $budgetByMonth = [];
        $expensesByMonth = [];
        $revenueByMonth = [];

        foreach ($months as $month) {
            $key = $month['key'];
            $budgetByMonth[$key] = 0.0;
            $expensesByMonth[$key] = 0.0;
            $revenueByMonth[$key] = 0.0;
        }

        foreach ($projects as $project) {
            if (!$project->budget_estimate) {
                continue;
            }

            $monthKey = Carbon::parse($project->created_at)->format('Y-m');
            if (!array_key_exists($monthKey, $budgetByMonth)) {
                continue;
            }

            $converted = $this->currencyConversionService->convertToBaseFromInvoice(
                (float) $project->budget_estimate,
                $project->currency
            );
            $budgetByMonth[$monthKey] += $converted['converted_amount'];
        }

        foreach ($companyPayments as $payment) {
            if (!$payment->net_amount) {
                continue;
            }

            $monthKey = Carbon::parse($payment->payment_date)->format('Y-m');
            if (!array_key_exists($monthKey, $expensesByMonth)) {
                continue;
            }

            $converted = $this->currencyConversionService->convertToBaseFromInvoice(
                (float) $payment->net_amount,
                $payment->currency
            );
            $expensesByMonth[$monthKey] += $converted['converted_amount'];
        }

        foreach ($custInvoices as $invoice) {
            if (!$invoice->total_amount) {
                continue;
            }

            $monthKey = Carbon::parse($invoice->created_at)->format('Y-m');
            if (!array_key_exists($monthKey, $revenueByMonth)) {
                continue;
            }

            $converted = $this->currencyConversionService->convertToBaseFromInvoice(
                (float) $invoice->total_amount,
                $invoice->currency
            );
            $revenueByMonth[$monthKey] += $converted['converted_amount'];
        }

        $budgetSeriesData = [];
        $expensesSeriesData = [];
        $revenueSeriesData = [];

        foreach ($months as $month) {
            $key = $month['key'];
            $budgetSeriesData[] = round($budgetByMonth[$key] ?? 0.0, 2);
            $expensesSeriesData[] = round($expensesByMonth[$key] ?? 0.0, 2);
            $revenueSeriesData[] = round($revenueByMonth[$key] ?? 0.0, 2);
        }

        return [
            'categories' => array_map(static function (array $month) {
                return $month['label'];
            }, $months),
            'series' => [
                [
                    'name' => 'Budgets',
                    'data' => $budgetSeriesData,
                ],
                [
                    'name' => 'Expenses',
                    'data' => $expensesSeriesData,
                ],
                [
                    'name' => 'Revenue',
                    'data' => $revenueSeriesData,
                ],
            ],
        ];
    }

    public function getCurrencyPreference(string $range = 'last_7_days'): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = CustInvoice::where('is_deleted', 0);
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $counts = $query->selectRaw('currency, COUNT(*) as total')
            ->whereNotNull('currency')
            ->groupBy('currency')
            ->pluck('total', 'currency')
            ->toArray();

        return $counts;
    }

    public function getPendingCustInvoices(string $range = 'last_7_days'): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = CustInvoice::where('is_deleted', 0)
            ->whereIn('status', ['sent', 'partial-paid']);

        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $invoices = $query->get(['id', 'status', 'total_amount', 'currency']);

        $invoiceIds = $invoices->pluck('id')->all();

        $paidByInvoice = [];
        if (!empty($invoiceIds)) {
            $paidByInvoice = CustPaymentAllocation::whereIn('cust_payment_allocations.invoice_id', $invoiceIds)
                ->where(function ($q) {
                    $q->where('cust_payment_allocations.is_deleted', 0)->orWhereNull('cust_payment_allocations.is_deleted');
                })
                ->join('cust_payments', 'cust_payments.id', '=', 'cust_payment_allocations.payment_id')
                ->where('cust_payments.transaction_type', 'receipt')
                ->selectRaw('cust_payment_allocations.invoice_id, SUM(cust_payment_allocations.allocated_amount) as total_paid')
                ->groupBy('cust_payment_allocations.invoice_id')
                ->pluck('total_paid', 'cust_payment_allocations.invoice_id')
                ->toArray();
        }

        $result = [];
        foreach ($invoices as $invoice) {
            $currency = $invoice->currency;
            if (!$currency) {
                continue;
            }

            $total = (float) $invoice->total_amount;
            $paid = (float) ($paidByInvoice[$invoice->id] ?? 0);
            $pending = $total - $paid;

            if ($pending <= 0) {
                continue;
            }

            $result[$currency] = ($result[$currency] ?? 0) + $pending;
        }

        // Round to 2 decimal places
        foreach ($result as $currency => $amount) {
            $result[$currency] = round($amount, 2);
        }

        return $result;
    }

    public function getPendingCompanyInvoices(string $range = 'last_7_days'): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = CompanyInvoice::where('is_deleted', 0)
            ->whereIn('status', ['sent', 'partial-paid']);

        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $invoices = $query->get(['id', 'status', 'total_amount', 'currency']);

        $invoiceIds = $invoices->pluck('id')->all();

        $paidByInvoice = [];
        if (!empty($invoiceIds)) {
            $paidByInvoice = CompanyPayment::whereIn('invoice_id', $invoiceIds)
                ->where('is_deleted', 0)
                ->where('transaction_type', 'receipt')
                ->selectRaw('invoice_id, SUM(amount_paid) as total_paid')
                ->groupBy('invoice_id')
                ->pluck('total_paid', 'invoice_id')
                ->toArray();
        }

        $result = [];
        foreach ($invoices as $invoice) {
            $currency = $invoice->currency;
            if (!$currency) {
                continue;
            }

            $total = (float) $invoice->total_amount;
            $paid = (float) ($paidByInvoice[$invoice->id] ?? 0);
            $pending = $total - $paid;

            if ($pending <= 0) {
                continue;
            }

            $result[$currency] = ($result[$currency] ?? 0) + $pending;
        }

        foreach ($result as $currency => $amount) {
            $result[$currency] = round($amount, 2);
        }

        return $result;
    }

    public function getRecentOrders(string $range = 'last_7_days', int $limit = 10): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = Order::with(['customer', 'project'])->where('is_deleted', 0);
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $orders = $query->orderByDesc('created_at')->limit($limit)->get();

        return $orders->map(function (Order $order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer?->name,
                'project_name' => $order->project?->name,
                'total_amount' => (float) ($order->total_amount ?? 0),
                'currency' => $order->currency,
                'status' => $order->status,
                'created_at' => $order->created_at,
            ];
        })->all();
    }

    public function getQuotationsOverview(string $range = 'last_7_days'): array
    {
        [$start, $end] = $this->resolveRange($range);

        $query = Quotation::where('is_deleted', 0);
        if ($start && $end) {
            $query->whereBetween('created_at', [$start, $end]);
        }

        $quotations = $query->get(['status']);

        // Quotation status enum: ['draft','sent','approved','rejected','revised']
        $statuses = [
            'draft' => 0,
            'sent' => 0,
            'approved' => 0,
            'rejected' => 0,
            'revised' => 0,
        ];

        foreach ($quotations as $quotation) {
            $status = $quotation->status;
            if (array_key_exists($status, $statuses)) {
                $statuses[$status]++;
            }
        }

        return $statuses;
    }

    private function buildCountWithDelta(int $current, int $previous): array
    {
        if ($previous === 0) {
            // When there were no items in the previous period, treat any
            // non-zero current value as a full increase, and leave delta
            // undefined only when both periods are zero.
            $delta = $current === 0 ? null : 100.0;
        } else {
            $delta = (($current - $previous) / $previous) * 100.0;
        }

        return [
            'current' => $current,
            'previous' => $previous,
            'delta_percentage' => $delta,
        ];
    }

    private function resolveRange(string $range): array
    {
        $now = Carbon::now();

        return match ($range) {
            'this_day' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
            'this_week' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
            'this_month' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            'this_year' => [$now->copy()->startOfYear(), $now->copy()->endOfYear()],
            'last_7_days' => [$now->copy()->subDays(6)->startOfDay(), $now->copy()->endOfDay()],
            'last_6_months' => [$now->copy()->subMonths(5)->startOfMonth(), $now->copy()->endOfMonth()],
            default => [null, null],
        };
    }
}
