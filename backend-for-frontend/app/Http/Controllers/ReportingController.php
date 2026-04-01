<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Reporting\ReportingService;
use Illuminate\Support\Facades\Gate;

class ReportingController extends Controller
{
    protected $reportingService;

    public function __construct(ReportingService $reportingService)
    {
        $this->reportingService = $reportingService;
    }

    // Orders Summary
    public function ordersSummary(Request $request)
    {
        try {
            $filters = $request->all();
            $orders = $this->reportingService->ordersSummary($filters);
            if (isset($orders['error'])) {
                return response()->json(['error' => $orders['error']], 400);
            }
            $authorizedOrders = $orders->filter(function ($order) {
                return \Gate::allows('view', $order);
            });
            return \App\Http\Resources\Reporting\OrdersSummaryResource::collection($authorizedOrders);
        } catch (\Exception $e) {
            \Log::error('Orders Summary Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Projects Summary
    public function projectsSummary(Request $request)
    {
        try {
            $filters = $request->all();
            $projects = $this->reportingService->projectsSummary($filters);
            if (isset($projects['error'])) {
                return response()->json(['error' => $projects['error']], 400);
            }
            $authorizedProjects = $projects->filter(function ($project) {
                return \Gate::allows('view', $project);
            });
            return \App\Http\Resources\Reporting\ProjectsSummaryResource::collection($authorizedProjects);
        } catch (\Exception $e) {
            \Log::error('Projects Summary Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Customer History
    public function customerHistory(Request $request)
    {
        try {
            $filters = $request->all();
            $customers = $this->reportingService->customerHistory($filters);
            if (isset($customers['error'])) {
                return response()->json(['error' => $customers['error']], 400);
            }
            $authorizedCustomers = $customers->filter(function ($customer) {
                return \Gate::allows('view', $customer);
            });
            return \App\Http\Resources\Reporting\CustomerHistoryResource::collection($authorizedCustomers);
        } catch (\Exception $e) {
            \Log::error('Customer History Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Revenue Snapshot
    public function revenueSnapshot(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->revenueSnapshot($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return new \App\Http\Resources\Reporting\RevenueSnapshotResource($data);
        } catch (\Exception $e) {
            \Log::error('Revenue Snapshot Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Invoices Report
    public function invoicesReport(Request $request)
    {
        try {
            $filters = $request->all();
            $invoices = $this->reportingService->invoicesReport($filters);
            if (isset($invoices['error'])) {
                return response()->json(['error' => $invoices['error']], 400);
            }
            $authorizedInvoices = $invoices->filter(function ($invoice) {
                return \Gate::allows('view', $invoice);
            });
            return \App\Http\Resources\Reporting\InvoicesReportResource::collection($authorizedInvoices);
        } catch (\Exception $e) {
            \Log::error('Invoices Report Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Payments to Companies
    public function paymentsToCompanies(Request $request)
    {
        try {
            $filters = $request->all();
            $payments = $this->reportingService->paymentsToCompanies($filters);
            if (isset($payments['error'])) {
                return response()->json(['error' => $payments['error']], 400);
            }
            $authorizedPayments = $payments->filter(function ($payment) {
                return \Gate::allows('view', $payment);
            });
            return \App\Http\Resources\Reporting\PaymentsToCompaniesResource::collection($authorizedPayments);
        } catch (\Exception $e) {
            \Log::error('Payments to Companies Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Margin Per Project
    public function marginPerProject(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->marginPerProject($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return \App\Http\Resources\Reporting\MarginPerProjectResource::collection($data);
        } catch (\Exception $e) {
            \Log::error('Margin Per Project Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // General Ledger
    public function generalLedger(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->generalLedger($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return new \App\Http\Resources\Reporting\GeneralLedgerResource($data);
        } catch (\Exception $e) {
            \Log::error('General Ledger Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Invoice Payments
    public function invoicePayments(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->invoicePayments($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'payments' => \App\Http\Resources\Reporting\InvoicePaymentsResource::collection($data['payments']),
                'totals' => $data['totals'],
                'forex' => $data['forex'] ?? null,
            ];
        } catch (\Exception $e) {
            \Log::error('Invoice Payments Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Invoice Payments - Customer
    public function invoicePaymentsCustomer(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->invoicePaymentsCustomer($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'payments' => \App\Http\Resources\Reporting\InvoicePaymentsResource::collection($data['payments']),
                'totals' => $data['totals'],
            ];
        } catch (\Exception $e) {
            \Log::error('Invoice Payments Customer Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Invoice Payments - Company
    public function invoicePaymentsCompany(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->invoicePaymentsCompany($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'payments' => \App\Http\Resources\Reporting\InvoicePaymentsResource::collection($data['payments']),
                'totals' => $data['totals'],
            ];
        } catch (\Exception $e) {
            \Log::error('Invoice Payments Company Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Tax Payments Customer
    public function taxPaymentsCustomer(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->taxPaymentsCustomer($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'transactions' => \App\Http\Resources\Reporting\TaxPaymentsCustomerResource::collection($data['transactions']),
                'totals' => $data['totals'],
            ];
        } catch (\Exception $e) {
            \Log::error('Tax Payments Customer Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Tax Payments Company
    public function taxPaymentsCompany(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->taxPaymentsCompany($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'transactions' => \App\Http\Resources\Reporting\TaxPaymentsCompanyResource::collection($data['transactions']),
                'totals' => $data['totals'],
            ];
        } catch (\Exception $e) {
            \Log::error('Tax Payments Company Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // Expense Report
    public function expenseReport(Request $request)
    {
        try {
            $filters = $request->all();
            $data = $this->reportingService->expenseReport($filters);
            if (isset($data['error'])) {
                return response()->json(['error' => $data['error']], 400);
            }
            return [
                'transactions' => \App\Http\Resources\Reporting\ExpenseReportResource::collection($data['transactions']),
                'totals' => $data['totals'],
            ];
        } catch (\Exception $e) {
            \Log::error('Expense Report Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        }
    }

    // PDF Export
    public function exportPdf(Request $request)
    {
        // try {
            $reportType = $request->input('reportType');
            $filters = $request->all();
            $pdf = $this->reportingService->exportPdf($reportType, $filters);
            if (is_array($pdf) && isset($pdf['error'])) {
                return response()->json(['error' => $pdf['error']], 400);
            }
            return $pdf;
        // } catch (\Exception $e) {
            \Log::error('PDF Export Error: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error.'], 500);
        // }
    }
}
