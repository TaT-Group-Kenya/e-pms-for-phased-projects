<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustPaymentAllocationStoreRequest;
use App\Http\Requests\CustPaymentAllocationUpdateRequest;
use App\Http\Resources\CustPaymentAllocationResource;
use App\Models\CustPaymentAllocation;
use App\Services\CustPaymentAllocationService;
use Illuminate\Http\Request;

class CustPaymentAllocationController extends Controller
{
    protected $service;

    public function __construct(CustPaymentAllocationService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustPaymentAllocation::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);

        return CustPaymentAllocationResource::collection($data);
    }

    public function store(CustPaymentAllocationStoreRequest $request)
    {
        $this->authorize('create', CustPaymentAllocation::class);
        $model = $this->service->create($request->validated());

        return new CustPaymentAllocationResource($model);
    }

    public function show(CustPaymentAllocation $custPaymentAllocation)
    {
        $this->authorize('view', $custPaymentAllocation);

        return new CustPaymentAllocationResource($custPaymentAllocation);
    }

    public function update(CustPaymentAllocationUpdateRequest $request, CustPaymentAllocation $custPaymentAllocation)
    {
        $this->authorize('update', $custPaymentAllocation);

        $updated = $this->service->update($custPaymentAllocation->id, $request->validated());

        return new CustPaymentAllocationResource($updated);
    }

    public function destroy(CustPaymentAllocation $custPaymentAllocation)
    {
        $this->authorize('delete', $custPaymentAllocation);

        $this->service->delete($custPaymentAllocation->id);

        return response()->noContent();
    }
}
