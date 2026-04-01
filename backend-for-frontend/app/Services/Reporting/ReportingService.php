<?php

namespace App\Services\Reporting;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Currency;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use App\Models\Download;

class ReportingService
{
    /**
     * Apply currency filter to queries
     */
    public function filterByCurrency($query, $currencyCode)
    {
        if ($currencyCode) {
            $query->where('currency', $currencyCode);
        }
        return $query;
    }

    // Placeholder methods for each report
    public function ordersSummary($filters) {
        $query = \App\Models\Order::with(['customer', 'creator']);
        // Authorization: Only show orders user is allowed to view
        // (Assume policy is set up for Order model)
        // Apply currency filter
        if (isset($filters['currency_code'])) {
            $query = $this->filterByCurrency($query, $filters['currency_code']);
        }
        // Additional filters (status, project, customer, date range)
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }
        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }
        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }
        // Return paginated or full collection
        return $query->get();
    }

    public function projectsSummary($filters) {
        $projectQuery = \App\Models\Project::with([
            'order',
            'customer',
            'category',
            'sourceOrigin',
            'location',
            'creator',
        ]);
        // Apply currency filter
        if (isset($filters['currency_code'])) {
            $projectQuery = $this->filterByCurrency($projectQuery, $filters['currency_code']);
        }
        // Additional filters (status, customer, date range, category, origin, location, job_reference_id)
        if (isset($filters['status'])) {
            $projectQuery->where('status', $filters['status']);
        }
        if (isset($filters['customer_id'])) {
            $projectQuery->where('customer_id', $filters['customer_id']);
        }
        if (isset($filters['project_category_id'])) {
            $projectQuery->where('project_category_id', $filters['project_category_id']);
        }
        if (isset($filters['project_source_origin_id'])) {
            $projectQuery->where('project_source_origin_id', $filters['project_source_origin_id']);
        }
        if (isset($filters['project_location_id'])) {
            $projectQuery->where('project_location_id', $filters['project_location_id']);
        }
        if (isset($filters['job_reference_id'])) {
            $projectQuery->where('job_reference_id', $filters['job_reference_id']);
        }
        if (isset($filters['from_date'])) {
            $projectQuery->whereDate('start_date', '>=', $filters['from_date']);
        }
        if (isset($filters['to_date'])) {
            $projectQuery->whereDate('end_date', '<=', $filters['to_date']);
        }
        $projects = $projectQuery->get();

        // Attach assigned companies/vendors from CompanyProject
        $companyProjects = \App\Models\CompanyProject::with('company')->get()->groupBy('project_id');
        foreach ($projects as $project) {
            $project->assigned_companies = $companyProjects->get($project->id) ? $companyProjects->get($project->id)->map(function($cp) {
                return $cp->company;
            }) : collect();
        }
        return $projects;
    }

    public function customerHistory($filters) {
        $query = \App\Models\Project::with([
            'customer.creator',
            'category',
            'sourceOrigin',
            'location',
        ]);

        if (isset($filters['from'])) {
            $query->whereDate('created_at', '>=', $filters['from']);
        }
        if (isset($filters['to'])) {
            $query->whereDate('created_at', '<=', $filters['to']);
        }

        return $query->get();
    }
    
    public function revenueSnapshot($filters) {
        // Payments received
        $paymentsQuery = \App\Models\CustPayment::query();
        // Invoices issued
        $invoicesQuery = \App\Models\CustInvoice::query();
        if (empty($filters['currency_code'])) {
            return [
                'error' => 'currency_code is required for revenue report.'
            ];
        }
        $paymentsQuery->where('currency', $filters['currency_code']);
        $invoicesQuery->where('currency', $filters['currency_code']);
        // Date range filter
        if (isset($filters['from'])) {
            $paymentsQuery->whereDate('created_at', '>=', $filters['from']);
            $invoicesQuery->whereDate('created_at', '>=', $filters['from']);
        }
        if (isset($filters['to'])) {
            $paymentsQuery->whereDate('created_at', '<=', $filters['to']);
            $invoicesQuery->whereDate('created_at', '<=', $filters['to']);
        }
        $totalPayments = $paymentsQuery->where('transaction_type', 'receipt')->sum('amount_paid');
        $totalRefunds = $paymentsQuery->where('transaction_type', '!=', 'receipt')->sum('amount_paid');
        $totalInvoices = $invoicesQuery->sum('total_amount');
        $outstandingInvoices = $totalInvoices - $totalPayments;
        
        return [
            'total_payments_received' => $totalPayments,
            'total_invoices_issued' => $totalInvoices,
            'outstanding_invoices' => $outstandingInvoices,
            'currency' => $filters['currency_code'],
            'total_refunds' => $totalRefunds,
        ];
    }
    
    public function invoicesReport($filters) {
        // Always default type to 'customer' and ensure it is sent
        $type = isset($filters['type']) && in_array($filters['type'], ['customer', 'company']) ? $filters['type'] : 'customer';
        $filters['type'] = $type;
        $status = $filters['status'] ?? null;
        $currency = $filters['currency_code'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        $model = $type === 'company' ? \App\Models\CompanyInvoice::class : \App\Models\CustInvoice::class;
        $query = $model::query();
        if ($status) {
            $query->where('status', $status);
        }
        if ($currency) {
            $query->where('currency', $currency);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        return $query->get();
    }
    
    public function paymentsToCompanies($filters) {
        $companyId = $filters['company_id'] ?? null;
        $currency = $filters['currency_code'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        $query = \App\Models\CompanyPayment::with(['invoice', 'invoice.company']);
        $query->where('direction', 'outgoing'); // Only payments to companies
        if ($companyId) {
            $query->whereHas('invoice', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }
        if ($currency) {
            $query->where('currency', $currency);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        $payments = $query->get();
        // Add computed fields
        foreach ($payments as $payment) {
            // Set amount fields
            $payment->amount = $payment->amount_paid ?? null;
            $payment->total_amount = $payment->amount_paid ?? null;
            $payment->tax_amount = $payment->tax_amount ?? 0;
            $payment->net_amount = $payment->amount_paid !== null && $payment->tax_amount !== null ? ($payment->amount_paid - $payment->tax_amount) : null;
            // Invoice info
            $invoice = $payment->invoice;
            $payment->invoice_number = $invoice ? $invoice->invoice_number : null;
            // Company info
            $company = ($invoice && $invoice->company) ? $invoice->company : null;
            $payment->company_id = $company ? $company->id : null;
            $payment->company_name = $company ? $company->name : null;
        }
        return $payments;
    }
    
    public function marginPerProject($filters) {
        $projectId = $filters['project_id'] ?? null;
        $currency = $filters['currency_code'] ?? null;
        $forexToKes = $filters['forex_to_kes'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        if (!$currency) {
            return [
                'error' => 'currency is required for margin per project report.'
            ];
        }

        if ($currency !== 'KES' && !$forexToKes) {
            return [
                'error' => 'forex to KES is required for margin per project report.'
            ];
        } 
        
        if ($currency === 'KES') {
            $forexToKes = 1;
        }

        $projects = \App\Models\Project::query();
        if ($projectId) {
            $projects->where('id', $projectId);
        }
        if ($currency) {
            $projects->where('currency', $currency);
        }
        if ($from) {
            $projects->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $projects->whereDate('created_at', '<=', $to);
        }
        $projects = $projects->get();

        $result = [];
        foreach ($projects as $project) {
            // Revenue: sum of invoices for project (convert to KES if not KES)
            $invoices = \App\Models\CustInvoice::where('project_id', $project->id)
                ->when($currency, function($q) use ($currency) { $q->where('currency', $currency); })
                ->get();
            $revenueKes = 0;
            foreach ($invoices as $invoice) {
                if ($invoice->currency === 'KES') {
                    $revenueKes += $invoice->total_amount;
                } else {
                    $revenueKes += $invoice->total_amount * $forexToKes;
                }
            }
            // Cost: sum of company invoices for project (all in KES)
            $costKes = \App\Models\CompanyInvoice::where('project_id', $project->id)
                ->sum('total_amount');
            $marginKes = $revenueKes - $costKes;
            $result[] = [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'revenue_kes' => $revenueKes,
                'cost_kes' => $costKes,
                'margin_kes' => $marginKes,
                'forex_to_kes' => $forexToKes,
            ];
        }
        return $result;
    }
    
    public function generalLedger($filters) {
        $currency = $filters['currency_code'] ?? null;
        $forex = $filters['forex'] ?? null;
        $projectId = $filters['project_id'] ?? null;
        $companyId = $filters['company_id'] ?? null;
        $customerId = $filters['customer_id'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        if (!$currency) {
            return [
                'error' => 'currency is required for general ledger report.'
            ];
        }

        if ($currency !== 'KES' && !$forex) {
            return [
                'error' => 'forex to KES is required for general ledger report.'
            ];
        }

        if ($currency === 'KES') {
            $forex = 1;
        }

        // Receivables (CustPayment)
        $receivablesQuery = \App\Models\CustPayment::with(['allocations.invoice.project', 'allocations.invoice.customer'])->where('transaction_type', 'receipt');
        if ($currency) {
            $receivablesQuery->where('currency', $currency);
        }
        if ($projectId) {
            $receivablesQuery->whereHas('allocations.invoice', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }
        if ($customerId) {
            $receivablesQuery->whereHas('allocations.invoice', function ($q) use ($customerId) {
                $q->where('customer_id', $customerId);
            });
        }
        if ($from) {
            $receivablesQuery->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $receivablesQuery->whereDate('created_at', '<=', $to);
        }
        $receivables = $receivablesQuery->get();
        // Attach project and customer from first allocation's invoice
        foreach ($receivables as $payment) {
            $payment->amount_kes = $payment->currency === 'KES' ? $payment->amount_paid : $payment->amount_paid * $forex;
            $payment->tax_amount_kes = $payment->currency === 'KES' ? $payment->tax_amount : $payment->tax_amount * $forex;
            $payment->net_amount_kes = $payment->currency === 'KES' ? $payment->net_amount : $payment->net_amount * $forex;
            $allocation = $payment->allocations->first();
            $invoice = $allocation ? $allocation->invoice : null;
            if ($invoice) {
                $payment->project_id = $invoice->project_id;
                $payment->project_name = $invoice->project ? $invoice->project->name : null;
                $payment->customer_id = $invoice->customer_id;
                $payment->customer_name = $invoice->customer ? $invoice->customer->name : null;
            } else {
                $payment->project_id = null;
                $payment->project_name = null;
                $payment->customer_id = null;
                $payment->customer_name = null;
            }
        }

        // Payables (CompanyPayment)
        $payablesQuery = \App\Models\CompanyPayment::with(['invoice', 'invoice.company', 'invoice.project'])->where('direction', 'outgoing');
        if ($projectId) {
            $payablesQuery->whereHas('invoice', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }
        if ($companyId) {
            $payablesQuery->whereHas('invoice', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }
        if ($from) {
            $payablesQuery->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $payablesQuery->whereDate('created_at', '<=', $to);
        }
        $payables = $payablesQuery->get();
        // Attach project and company from invoice
        foreach ($payables as $payment) {
            $invoice = $payment->invoice;
            if ($invoice) {
                $payment->project_id = $invoice->project_id;
                $payment->project_name = $invoice->project ? $invoice->project->name : null;
                $payment->company_id = $invoice->company_id;
                $payment->company_name = $invoice->company ? $invoice->company->name : null;
            } else {
                $payment->project_id = null;
                $payment->project_name = null;
                $payment->company_id = null;
                $payment->company_name = null;
            }
        }

        // Compute totals for receivables
        $totalReceivables = 0;
        $totalReceivablesTax = 0;
        $totalReceivablesNet = 0;
        foreach ($receivables as $payment) {
            $tax = $payment->tax_amount ?? 0;
            $totalReceivables += $payment->amount_paid;
            $totalReceivablesTax += $tax;
            $totalReceivablesNet += ($payment->amount_paid - $tax);
            $payment->tax_amount = $tax;
            $payment->net_amount = $payment->amount_paid - $tax;
        }

        // Compute totals for payables
        $totalPayables = 0;
        $totalPayablesTax = 0;
        $totalPayablesNet = 0;
        foreach ($payables as $payment) {
            $tax = $payment->tax_amount ?? 0;
            $totalPayables += $payment->amount_paid;
            $totalPayablesTax += $tax;
            $totalPayablesNet += ($payment->amount_paid - $tax);
            $payment->tax_amount = $tax;
            $payment->net_amount = $payment->amount_paid - $tax;
        }

        return [
            'receivables' => $receivables,
            'payables' => $payables,
            'forex' => $forex,
            'totals' => [
                'receivables' => [
                    'total' => $totalReceivables,
                    'taxes' => $totalReceivablesTax,
                    'net' => $totalReceivablesNet,
                ],
                'payables' => [
                    'total' => $totalPayables,
                    'taxes' => $totalPayablesTax,
                    'net' => $totalPayablesNet,
                ],
            ],
        ];
    }

    public function invoicePaymentsCustomer($filters) {
        \Log::info('Generating Invoice Payments Customer Report', ['filters' => $filters]);

        $currency = $filters['currency_code'] ?? null;
        $customerId = $filters['customer_id'] ?? null;
        $jobReferenceId = $filters['job_reference_id'] ?? null;
        $invoiceNumber = $filters['invoice_number'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        // Mandatory filter
        if (!$currency) {
            return [
                'error' => 'currency is required for invoice payments customer report.'
            ];
        }

        $query = \App\Models\CustPayment::with(['invoices.customer', 'createdByUser'])
            ->where('transaction_type', 'receipt');

        if ($currency) {
            $query->where('currency', $currency);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        if ($customerId) {
            $query->whereHas('invoices', function ($q) use ($customerId) {
                $q->where('customer_id', $customerId);
            });
        }
        if ($jobReferenceId) {
            $query->whereHas('invoices', function ($q) use ($jobReferenceId) {
                $q->where('job_reference_id', 'like', "%{$jobReferenceId}%");
            });
        }
        if ($invoiceNumber) {
            $query->whereHas('invoices', function ($q) use ($invoiceNumber) {
                $q->where('invoice_number', 'like', "%{$invoiceNumber}%");
            });
        }

        $payments = $query->get();

        foreach ($payments as $payment) {
            $invoice = $payment->invoices->first();
            $customer = $invoice ? $invoice->customer : null;

            $payment->customer_name = $customer ? $customer->name : null;
            $payment->job_reference_id = $invoice ? $invoice->job_reference_id : null;
            $payment->invoice_number = $invoice ? $invoice->invoice_number : null;

            $payment->amount = $payment->amount_paid;

            $createdBy = $payment->createdByUser;
            $transactedByName = null;
            if ($createdBy) {
                $fullName = trim(($createdBy->first_name ?? '') . ' ' . ($createdBy->last_name ?? ''));
                if ($fullName !== '') {
                    $transactedByName = $fullName;
                } else {
                    $transactedByName = $createdBy->email ?? null;
                }
            }
            $payment->transacted_by_name = $transactedByName;
        }

        $totalAmount = $payments->sum('amount_paid');
        $totalTax = $payments->sum('tax_amount');
        $totalNet = $payments->sum('net_amount');

        return [
            'payments' => $payments,
            'totals' => [
                'total' => $totalAmount,
                'taxes' => $totalTax,
                'net' => $totalNet,
            ],
        ];
    }

    public function invoicePaymentsCompany($filters) {
        \Log::info('Generating Invoice Payments Company Report', ['filters' => $filters]);

        $currency = $filters['currency_code'] ?? null;
        $companyId = $filters['company_id'] ?? null;
        $jobReferenceId = $filters['job_reference_id'] ?? null;
        $invoiceNumber = $filters['invoice_number'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        // Mandatory filter
        if (!$currency) {
            return [
                'error' => 'currency is required for invoice payments company report.'
            ];
        }

        $query = \App\Models\CompanyPayment::with(['invoice.company', 'invoice.project', 'createdByUser'])
            ->where('transaction_type', 'receipt');

        if ($currency) {
            $query->where('currency', $currency);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        if ($companyId) {
            $query->whereHas('invoice', function ($q) use ($companyId) {
                $q->where('company_id', $companyId);
            });
        }
        if ($jobReferenceId) {
            $query->whereHas('invoice.project', function ($q) use ($jobReferenceId) {
                $q->where('job_reference_id', 'like', "%{$jobReferenceId}%");
            });
        }
        if ($invoiceNumber) {
            $query->whereHas('invoice', function ($q) use ($invoiceNumber) {
                $q->where('invoice_number', 'like', "%{$invoiceNumber}%");
            });
        }

        $payments = $query->get();

        foreach ($payments as $payment) {
            $invoice = $payment->invoice;
            $company = $invoice ? $invoice->company : null;
            $project = $invoice ? $invoice->project : null;

            $payment->company_name = $company ? $company->name : null;
            $payment->job_reference_id = $project ? $project->job_reference_id : null;
            $payment->invoice_number = $invoice ? $invoice->invoice_number : null;

            $payment->amount = $payment->amount_paid;

            $createdBy = $payment->createdByUser;
            $transactedByName = null;
            if ($createdBy) {
                $fullName = trim(($createdBy->first_name ?? '') . ' ' . ($createdBy->last_name ?? ''));
                if ($fullName !== '') {
                    $transactedByName = $fullName;
                } else {
                    $transactedByName = $createdBy->email ?? null;
                }
            }
            $payment->transacted_by_name = $transactedByName;
        }

        $totalAmount = $payments->sum('amount_paid');
        $totalTax = $payments->sum('tax_amount');
        $totalNet = $payments->sum('net_amount');

        return [
            'payments' => $payments,
            'totals' => [
                'total' => $totalAmount,
                'taxes' => $totalTax,
                'net' => $totalNet,
            ],
        ];
    }
    
    public function invoicePayments($filters) {
        \Log::info('Generating Invoice Payments Report', ['filters' => $filters]);
        $type = $filters['type'] ?? null; // 'customer' or 'company'
        $currency = $filters['currency_code'] ?? null;
        $forex = $filters['forex'] ?? null;
        $projectId = $filters['project_id'] ?? null;
        $companyId = $filters['company_id'] ?? null;
        $customerId = $filters['customer_id'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;

        if (!$currency) {
            return [
                'error' => 'currency is required for invoice payments report.'
            ];
        }

        if (!$type || !in_array($type, ['customer', 'company'])) {
            return [
                'error' => 'type is required for invoice payments report.'
            ];
        }

        // Select model and eager load relations
        if ($type === 'company') {
            $query = \App\Models\CompanyPayment::with('invoice.company')->where('transaction_type', 'receipt');
        } else {
            $query = \App\Models\CustPayment::with('allocations.invoice.customer')->where('transaction_type', 'receipt');
        }
        if ($currency) {
            $query->where('currency', $currency);
        }
        if ($projectId) {
            $query->where('project_id', $projectId);
        }
        if ($companyId && $type === 'company') {
            $query->where('company_id', $companyId);
        }
        if ($customerId && $type === 'customer') {
            $query->where('customer_id', $customerId);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        $payments = $query->get();

        // For company payments, all amounts are in KES, no forex, no computation
        if ($type === 'company') {
            foreach ($payments as $payment) {
                $payment->amount = $payment->amount_paid;
                $payment->tax_amount = $payment->tax_amount;
                $payment->net_amount = $payment->net_amount;
                // Load invoice for company payment
                $invoice = isset($payment->invoice) ? $payment->invoice : null;
                $payment->invoice_number = $invoice ? $invoice->invoice_number : null;
                $payment->company_name = $invoice && $invoice->company ? $invoice->company->name : null;
            }
        } else {
            // For customer payments, apply forex if set, otherwise use original amount
            foreach ($payments as $payment) {
                $payment->amount = $payment->amount_paid;
                $payment->tax_amount = $payment->tax_amount;
                $payment->net_amount = $payment->net_amount;
                // Load first invoice via allocations
                $invoice = $payment->invoices()->first();
                $payment->invoice_number = $invoice ? $invoice->invoice_number : null;
                $payment->customer_name = $invoice && $invoice->customer ? $invoice->customer->name : null;
            }
        }

        // Totals
        $totalAmount = $payments->sum('amount');
        $totalTax = $payments->sum('tax_amount');
        $totalNet = $payments->sum('net_amount');

        return [
            'payments' => $payments,
            'forex' => $forex,
            'totals' => [
                'total' => $totalAmount,
                'taxes' => $totalTax,
                'net' => $totalNet,
            ],
        ];
    }
    
    public function taxPaymentsCustomer($filters) {
        $currency = $filters['currency_code'] ?? null;
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;
        $customerId = $filters['customer_id'] ?? null;

        // Mandatory filter
        if (!$currency) {
            return [
                'error' => 'currency is required for tax payments customer report.'
            ];
        }

        $query = \App\Models\CustomerTransactionsLedger::with(['payment','payment.invoices']);
        $query->where('transaction_type', 'receipt');
        $query->where('source_type', 'cust_invoice');
        $query->where('transaction_currency', $currency);
        if ($customerId) {
            $query->where('customer_id', $customerId);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        $transactions = $query->get();

        // Load invoice number and customer name
        foreach ($transactions as $txn) {
            $invoice = $txn->payment && $txn->payment->invoices ? $txn->payment->invoices->first() : null;
            $txn->invoice_number = $invoice ? $invoice->invoice_number : null;
            $customer = \App\Models\Customer::find($txn->customer_id);
            $txn->customer_name = $customer ? $customer->name : null;
        }

        // Totals
        $totalTax = $transactions->sum('tax_amount');
        $totalConvertedTax = $transactions->sum('converted_tax_amount');

        return [
            'transactions' => $transactions,
            'totals' => [
                'taxes' => $totalTax,
                'converted_taxes' => $totalConvertedTax,
            ],
        ];
    }
    
    public function taxPaymentsCompany($filters) {
        $currency = $filters['currency_code'] ?? 'KES';
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;
        $companyId = $filters['company_id'] ?? null;

        // Mandatory filter
        if (!$currency) {
            return [
                'error' => 'currency_code is required for tax payments company report.'
            ];
        }

        $query = \App\Models\CompanyTransactionsLedger::with(['payment','payment.invoice']);
        $query->where('transaction_type', 'payment');
        $query->where('source_type', 'company_invoice');
        $query->where('base_currency', $currency);
        if ($companyId) {
            $query->where('company_id', $companyId);
        }
        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        $transactions = $query->get();

        // Load invoice number and company name
        foreach ($transactions as $txn) {
            $payment = $txn->payment ?? null;
            $invoice = $payment ? $payment->invoice : null;
            $txn->invoice_number = $invoice ? $invoice->invoice_number : null;
            $company = \App\Models\Company::find($txn->company_id);
            $txn->company_name = $company ? $company->name : null;
        }

        // Totals (only tax)
        $totalTax = $transactions->sum('tax_amount');

        return [
            'transactions' => $transactions,
            'totals' => [
                'taxes' => $totalTax,
            ],
        ];
    }
    
    public function expenseReport($filters) {
        $currency = $filters['currency_code'] ?? 'KES';
        $from = $filters['from'] ?? null;
        $to = $filters['to'] ?? null;
        $categoryId = $filters['category'] ?? null;
        $costCenterId = $filters['cost_center'] ?? null;

        // Mandatory filter
        if (!$currency) {
            return [
                'error' => 'currency_code is required for expense report.'
            ];
        }

        $query = \App\Models\Transaction::query();
        $query->where('source_type', 'office_expense');
        $query->where('base_currency', $currency);
        $query->where('transaction_type', 'expense');

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }
        $transactions = $query->get();

        // Filter by cost center and category on OfficeExpense
        $filtered = $transactions->filter(function($txn) use ($categoryId, $costCenterId) {
            $officeExpense = \App\Models\OfficeExpense::find($txn->source_id);
            $txn->expense = $officeExpense ? $officeExpense->description : null;
            $txn->category = $officeExpense && isset($officeExpense->category) ? $officeExpense->category->name : null;
            $txn->cost_center = $officeExpense && isset($officeExpense->costCenter) ? $officeExpense->costCenter->name : null;
            if ($categoryId && (!isset($officeExpense->category) || $officeExpense->category->id != $categoryId)) {
                return false;
            }
            if ($costCenterId && (!isset($officeExpense->costCenter) || $officeExpense->costCenter->id != $costCenterId)) {
                return false;
            }
            return true;
        })->values();

        // Totals
        $totalAmount = $filtered->sum('amount');
        $totalTax = $filtered->sum('tax_amount');
        $totalNet = $filtered->sum('net_amount');

        return [
            'transactions' => $filtered,
            'totals' => [
                'total' => $totalAmount,
                'taxes' => $totalTax,
                'net' => $totalNet,
            ],
        ];
    }
    
    public function exportPdf($reportType, $filters)
    {
        switch ($reportType) {
            case 'ordersSummary':
                return $this->exportOrdersSummaryPdf($filters);
            case 'projectsSummary':
                return $this->exportProjectsSummaryPdf($filters);
            case 'customerHistory':
                return $this->exportCustomerHistoryPdf($filters);
            case 'revenueSnapshot':
                return $this->exportRevenueSnapshotPdf($filters);
            case 'invoicesReport':
                return $this->exportInvoicesReportPdf($filters);
            case 'paymentsToCompanies':
                return $this->exportPaymentsToCompaniesPdf($filters);
            case 'marginPerProject':
                return $this->exportMarginPerProjectPdf($filters);
            case 'generalLedger':
                return $this->exportGeneralLedgerPdf($filters);
            case 'invoicePayments':
                return $this->exportInvoicePaymentsPdf($filters);
            case 'invoicePaymentsCustomer':
                return $this->exportInvoicePaymentsCustomerPdf($filters);
            case 'invoicePaymentsCompany':
                return $this->exportInvoicePaymentsCompanyPdf($filters);
            case 'taxPaymentsCustomer':
                return $this->exportTaxPaymentsCustomerPdf($filters);
            case 'taxPaymentsCompany':
                return $this->exportTaxPaymentsCompanyPdf($filters);
            case 'expenseReport':
                return $this->exportExpenseReportPdf($filters);
            default:
                return [
                    'error' => 'Invalid report type.'
                ];
        }
    }
    // Private export methods for each report
    private function exportOrdersSummaryPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->ordersSummary($filters);
        $resourceCollection = \App\Http\Resources\Reporting\OrdersSummaryResource::collection($rawData);
        $data = [];
        foreach ($resourceCollection as $item) {
            $arr = $item->toArray(null);
            if (!isset($arr['customer_name']) || !$arr['customer_name']) {
                $arr['customer_name'] = optional($item->resource->customer)->name ?? '';
            }
            if (!isset($arr['quotation_title']) || !$arr['quotation_title']) {
                $arr['quotation_title'] = optional($item->resource->quotation)->title ?? '';
            }
            if (isset($arr['project']) && is_object($arr['project']) && isset($arr['project']->name)) {
                $arr['project'] = $arr['project']->name;
            }
            $data[] = $arr;
        }
        return $this->renderPdf('pdf.orders-summary', $data, $filters, $userId, 'ordersSummary');
    }

    private function exportProjectsSummaryPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->projectsSummary($filters);
        $resourceCollection = \App\Http\Resources\Reporting\ProjectsSummaryResource::collection($rawData);
        $data = [];
        foreach ($resourceCollection as $item) {
            $data[] = $item->toArray(null);
        }
        return $this->renderPdf('pdf.projects-summary', $data, $filters, $userId, 'projectsSummary');
    }

    private function exportCustomerHistoryPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->customerHistory($filters);
        $resourceCollection = \App\Http\Resources\Reporting\CustomerHistoryResource::collection($rawData);
        $data = [];
        foreach ($resourceCollection as $item) {
            $data[] = $item->toArray(null);
        }
        return $this->renderPdf('pdf.customer-history', $data, $filters, $userId, 'customerHistory');
    }

    private function exportRevenueSnapshotPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->revenueSnapshot($filters);
        $data = new \App\Http\Resources\Reporting\RevenueSnapshotResource($rawData);
        return $this->renderPdf('pdf.revenue-snapshot', $data, $filters, $userId, 'revenueSnapshot');
    }

    private function exportInvoicesReportPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->invoicesReport($filters);
        $resourceCollection = \App\Http\Resources\Reporting\InvoicesReportResource::collection($rawData);
        return $this->renderPdf('pdf.invoices-report', $resourceCollection, $filters, $userId, 'invoicesReport');
    }

    private function exportPaymentsToCompaniesPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->paymentsToCompanies($filters);
        $resourceCollection = \App\Http\Resources\Reporting\PaymentsToCompaniesResource::collection($rawData['transactions'] ?? $rawData);
        $transactionsArray = [];
        foreach ($resourceCollection as $item) {
            $transactionsArray[] = $item->toArray(null);
        }
        return $this->renderPdf('pdf.payments-to-companies', $transactionsArray, $filters, $userId, 'paymentsToCompanies');
    }

    private function exportMarginPerProjectPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->marginPerProject($filters);
        $resourceCollection = \App\Http\Resources\Reporting\MarginPerProjectResource::collection($rawData);
        $data = [];
        foreach ($resourceCollection as $item) {
            $data[] = $item->toArray(null);
        }
        return $this->renderPdf('pdf.margin-per-project', $data, $filters, $userId, 'marginPerProject');
    }

    private function exportGeneralLedgerPdf($filters) {
        $userId = Auth::id() ?? null;
        $data = $this->generalLedger($filters);
        \Log::info('General Ledger raw data', ['data' => $data]);
        return $this->renderPdf('pdf.general-ledger', $data, $filters, $userId, 'generalLedger');
    }

    private function exportInvoicePaymentsPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->invoicePayments($filters);
        return $this->renderPdf('pdf.invoice-payments', $rawData, $filters, $userId, 'invoicePayments');
    }

    private function exportInvoicePaymentsCustomerPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->invoicePaymentsCustomer($filters);
        $resourceCollection = \App\Http\Resources\Reporting\InvoicePaymentsResource::collection($rawData['payments']);
        $data = [
            'payments' => $resourceCollection,
            'totals' => $rawData['totals'],
        ];
        return $this->renderPdf('pdf.invoice-payments-customer', $data, $filters, $userId, 'invoicePaymentsCustomer');
    }

    private function exportInvoicePaymentsCompanyPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->invoicePaymentsCompany($filters);
        $resourceCollection = \App\Http\Resources\Reporting\InvoicePaymentsResource::collection($rawData['payments']);
        $data = [
            'payments' => $resourceCollection,
            'totals' => $rawData['totals'],
        ];
        return $this->renderPdf('pdf.invoice-payments-company', $data, $filters, $userId, 'invoicePaymentsCompany');
    }

    private function exportTaxPaymentsCustomerPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->taxPaymentsCustomer($filters);
        $resourceCollection = \App\Http\Resources\Reporting\TaxPaymentsCustomerResource::collection($rawData['transactions'] ?? $rawData);
        $data = [
            'transactions' => $resourceCollection,
            'totals' => $rawData['totals'],
        ];
        return $this->renderPdf('pdf.tax-payments-customer', $data, $filters, $userId, 'taxPaymentsCustomer');
    }

    private function exportTaxPaymentsCompanyPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->taxPaymentsCompany($filters);
        $resourceCollection = \App\Http\Resources\Reporting\TaxPaymentsCompanyResource::collection($rawData['transactions'] ?? $rawData);
        $transactionsArray = [];
        foreach ($resourceCollection as $item) {
            $transactionsArray[] = $item->toArray(null);
        }
        $data = [
            'transactions' => $transactionsArray,
            'totals' => isset($rawData['totals']) ? $rawData['totals'] : [],
        ];
        return $this->renderPdf('pdf.tax-payments-company', $data, $filters, $userId, 'taxPaymentsCompany');
    }

    private function exportExpenseReportPdf($filters) {
        $userId = Auth::id() ?? null;
        $rawData = $this->expenseReport($filters);
        $resourceCollection = \App\Http\Resources\Reporting\ExpenseReportResource::collection($rawData['transactions'] ?? $rawData);
        $transactionsArray = $resourceCollection->resolve();
        $data = [
            'transactions' => $transactionsArray,
            'totals' => isset($rawData['totals']) ? $rawData['totals'] : [
                'total' => 0,
                'taxes' => 0,
                'net' => 0,
            ],
        ];
        return $this->renderPdf('pdf.expense-report', $data, $filters, $userId, 'expenseReport');
    }

    // Helper method to render and store PDF
    private function renderPdf($view, $data, $filters, $userId, $reportType) {
        $senderName = config('app.name');
        $senderEmail = config('mail.from.address');
        $generatedAt = now();
        $options = new Options();
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);
        $html = view($view, [
            'reportType' => $reportType,
            'data' => $data,
            'filters' => $filters,
            'senderName' => $senderName,
            'senderEmail' => $senderEmail,
            'generatedAt' => $generatedAt,
        ])->render();
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();
        $output = $dompdf->output();
        $fileName = $reportType . '-' . now()->format('Y-m-d') . '_report.pdf';
        $relativePath = 'reports/' . $fileName;
        Storage::disk('public')->put($relativePath, $output);
        $download = Download::firstOrNew(['name' => $fileName]);
        $download->path = $relativePath;
        $download->updated_at = now();
        $download->updated_by = $userId;
        if (!$download->exists) {
            $download->created_at = now();
            $download->created_by = $userId;
        }
        $download->save();
        $pdf = [
            'fileName'     => $fileName,
            'relativePath' => $relativePath,
            'output'       => $output,
        ];
        return response()->streamDownload(
            function () use ($pdf) {
                echo $pdf['output'];
            },
            $pdf['fileName'],
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }
}
