<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustPayment;
use App\Services\CustPaymentService;
use App\Http\Resources\CustPaymentResource;
use App\Http\Requests\CustPaymentStoreRequest;
use App\Http\Requests\CustPaymentUpdateRequest;

class CustPaymentController extends Controller
{
    protected CustPaymentService $service;

    public function __construct(CustPaymentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustPayment::class);

        $perPage = (int) $request->get('per_page', 15);
        $page = (int) $request->get('page', 1);
        $filters = $request->except('per_page', 'page');

        $data = $this->service->index($filters, $perPage, $page);

        return CustPaymentResource::collection($data);
    }

    public function store(CustPaymentStoreRequest $request)
    {
        $this->authorize('create', CustPayment::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);

        return new CustPaymentResource($model);
    }

    public function show(CustPayment $custPayment)
    {
        $this->authorize('view', $custPayment);

        $custPayment->loadMissing(['customerLedgerEntries', 'allocations', 'invoices']);

        return new CustPaymentResource($custPayment);
    }

    public function update(CustPaymentUpdateRequest $request, CustPayment $custPayment)
    {
        $this->authorize('update', $custPayment);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        $updated = $this->service->update($custPayment->id, $validated);

        return new CustPaymentResource($updated);
    }

    public function destroy(CustPayment $custPayment)
    {
        $this->authorize('delete', $custPayment);

        $this->service->delete($custPayment->id);

        return response()->noContent();
    }
}
