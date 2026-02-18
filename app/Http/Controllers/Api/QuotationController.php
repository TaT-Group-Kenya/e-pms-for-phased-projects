<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Quotation;
use App\Services\QuotationService;
use App\Http\Resources\QuotationResource;
use App\Http\Requests\QuotationStoreRequest;
use App\Http\Requests\QuotationUpdateRequest;

class QuotationController extends Controller
{
    protected $service;

    public function __construct(QuotationService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Quotation::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return QuotationResource::collection($data);
    }

    public function store(QuotationStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new QuotationResource($model);
    }

    public function show(Quotation $quotation)
    {
        $this->authorize('view', $quotation);

        return new QuotationResource($quotation);
    }

    public function update(QuotationUpdateRequest $request, Quotation $quotation)
    {
        $this->authorize('update', $quotation);

        $updated = $this->service->update($quotation->id, $request->validated());
        return new QuotationResource($updated);
    }

    public function destroy(Quotation $quotation)
    {
        $this->authorize('delete', $quotation);

        $this->service->delete($quotation->id);
        return response()->noContent();
    }
}