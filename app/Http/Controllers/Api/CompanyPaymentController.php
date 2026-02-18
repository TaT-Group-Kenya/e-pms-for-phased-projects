<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyPayment;
use App\Services\CompanyPaymentService;
use App\Http\Resources\CompanyPaymentResource;
use App\Http\Requests\CompanyPaymentStoreRequest;
use App\Http\Requests\CompanyPaymentUpdateRequest;

class CompanyPaymentController extends Controller
{
    protected $service;

    public function __construct(CompanyPaymentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyPayment::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyPaymentResource::collection($data);
    }

    public function store(CompanyPaymentStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyPaymentResource($model);
    }

    public function show(CompanyPayment $companyPayment)
    {
        $this->authorize('view', $companyPayment);

        return new CompanyPaymentResource($companyPayment);
    }

    public function update(CompanyPaymentUpdateRequest $request, CompanyPayment $companyPayment)
    {
        $this->authorize('update', $companyPayment);

        $updated = $this->service->update($companyPayment->id, $request->validated());
        return new CompanyPaymentResource($updated);
    }

    public function destroy(CompanyPayment $companyPayment)
    {
        $this->authorize('delete', $companyPayment);

        $this->service->delete($companyPayment->id);
        return response()->noContent();
    }
}