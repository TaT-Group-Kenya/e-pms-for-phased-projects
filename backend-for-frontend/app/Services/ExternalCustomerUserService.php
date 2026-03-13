<?php

namespace App\Services;

use App\Models\Quotation;
use App\Models\Order;
use App\Models\CustInvoice;
use App\Models\CustCreditNote;
use App\Models\Project;
use App\Models\CustPayment;

class ExternalCustomerUserService
{
    public function getQuotations($customerId)
    {
        return Quotation::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getOrders($customerId)
    {
        return Order::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getCustInvoices($customerId)
    {
        $invoices = CustInvoice::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->with('payments')
            ->get();

        // Transform to include total_paid but exclude payments
        return $invoices->map(function ($invoice) {
            $arr = $invoice->toArray();
            unset($arr['payments']);
            $arr['total_paid'] = $invoice->total_paid;
            return $arr;
        });
    }

    public function getCustCreditNotes($customerId)
    {
        return CustCreditNote::whereHas('invoice', function($q) use ($customerId) {
                $q->where('customer_id', $customerId)
                  ->where('is_deleted', false)
                  ->where('status', '!=', 'draft');
            })
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getProjects($customerId)
    {
        return Project::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }
    /**
     * Get overview summary for customer dashboard
     */
    public function getOverview($customerId)
    {
        // Creative summary: counts, totals, recent activity
        $quotationsCount = Quotation::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')->count();
        $ordersCount = Order::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')->count();
        $invoicesCount = CustInvoice::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')->count();
        $projectsCount = Project::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')->count();
        $paymentsCount = CustPayment::whereHas('customerLedgerEntries', function($q) use ($customerId) {
                $q->where('customer_id', $customerId)->where('is_deleted', false);
            })
            ->where('is_deleted', false)
            ->count();

        $totalInvoiced = CustInvoice::where('customer_id', $customerId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->sum('total_amount');
        $totalPaid = 0;

        $recentQuotations =[];
        $recentOrders = [];
        $recentInvoices = [];

        return [
            'counts' => [
                'quotations' => $quotationsCount,
                'orders' => $ordersCount,
                'invoices' => $invoicesCount,
                'projects' => $projectsCount,
                'payments' => $paymentsCount,
            ],
            'totals' => [
                'invoiced' => $totalInvoiced,
                'paid' => $totalPaid,
            ],
            'recent' => [
                'quotations' => $recentQuotations,
                'orders' => $recentOrders,
                'invoices' => $recentInvoices,
            ]
        ];
    }

    public function getCustPayments($customerId)
    {
        return CustPayment::whereHas('customerLedgerEntries', function($q) use ($customerId) {
                $q->where('customer_id', $customerId)->where('is_deleted', false);
            })
            ->where('is_deleted', false)
            ->orderByDesc('created_at')
            ->get();
    }
}
