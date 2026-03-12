<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Services\ExternalCompanyUserService;

class ExternalCompanyUserController extends Controller {
    protected $service;

    public function __construct(ExternalCompanyUserService $service)
    {
        $this->service = $service;
    }

    public function overview(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $data = $this->service->getOverview($companyId);
        return response()->json($data);
    }

    public function invoices(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $data = $this->service->getInvoices($companyId);
        return response()->json($data);
    }

    public function creditNotes(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $data = $this->service->getCreditNotes($companyId);
        return response()->json($data);
    }

    public function projects(Request $request)
    {
        $companyId = Auth::user()->company_id;
        $projects = $this->service->getProjects($companyId);
        return response()->json(\App\Http\Resources\CompanyProjectResource::collection($projects));
    }
}
