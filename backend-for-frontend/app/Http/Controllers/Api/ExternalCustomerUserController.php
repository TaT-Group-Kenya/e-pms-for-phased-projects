<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Services\ExternalCustomerUserService;

class ExternalCustomerUserController extends Controller {
    
protected $service;

    public function __construct(ExternalCustomerUserService $service)
    {
        $this->service = $service;
    }
    /**
     * Dashboard overview endpoint
     */
    public function overview(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getOverview($customerId);
        return response()->json($data);
    }

    public function quotations(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getQuotations($customerId);
        return response()->json($data);
    }

    public function orders(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getOrders($customerId);
        return response()->json($data);
    }

    public function invoices(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getCustInvoices($customerId);
        return response()->json($data);
    }

    public function creditNotes(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getCustCreditNotes($customerId);
        return response()->json($data);
    }

    public function projects(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getProjects($customerId);
        return response()->json($data);
    }

    public function payments(Request $request)
    {
        $customerId = Auth::user()->customer_id;
        $data = $this->service->getCustPayments($customerId);
        return response()->json($data);
    }
}
