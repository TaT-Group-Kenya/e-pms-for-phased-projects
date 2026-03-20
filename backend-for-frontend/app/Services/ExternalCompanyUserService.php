<?php

namespace App\Services;

use App\Models\CompanyInvoice;
use App\Models\CompanyCreditNote;
use App\Models\CompanyProject;

class ExternalCompanyUserService
{
    public function getInvoices($companyId)
    {
        $invoices = CompanyInvoice::where('company_id', $companyId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
        
        return $invoices->map(function ($invoice) {
            $arr = $invoice->toArray();
            unset($arr['payments']);
            $arr['total_paid'] = $invoice->total_paid;
            return $arr;
        });
    }

    public function getCreditNotes($companyId)
    {
        return CompanyCreditNote::where('company_id', $companyId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->orderByDesc('created_at')
            ->get();
    }

    public function getProjects($companyId)
    {
        // 1. Get all allocations for this company (company_projects)
        $allocations = CompanyProject::with(['project', 'phase'])
            ->where('company_id', $companyId)
            ->where('is_deleted', false)
            ->get();
        
            return $allocations;
    }

    public function getOverview($companyId)
    {
        $invoicesCount = CompanyInvoice::where('company_id', $companyId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')->count();
        $creditNotesCount = 0;
        $projectsCount = CompanyProject::where('company_id', $companyId)
            ->where('is_deleted', false)->count();
        $totalInvoiced = CompanyInvoice::where('company_id', $companyId)
            ->where('is_deleted', false)
            ->where('status', '!=', 'draft')
            ->sum('total_amount');
        $totalPaid = 0; // Implement as needed

        return [
            'counts' => [
                'invoices' => $invoicesCount,
                'credit_notes' => $creditNotesCount,
                'projects' => $projectsCount,
            ],
            'totals' => [
                'invoiced' => $totalInvoiced,
                'paid' => $totalPaid,
            ]
        ];
    }
}
