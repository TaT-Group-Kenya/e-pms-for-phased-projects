<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tax;
use App\Services\TaxService;
use App\Http\Resources\TaxResource;
use App\Http\Requests\TaxStoreRequest;
use App\Http\Requests\TaxUpdateRequest;

class TaxController extends Controller
{
    protected $service;

    public function __construct(TaxService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Tax::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return TaxResource::collection($data);
    }

    public function store(TaxStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new TaxResource($model);
    }

    public function show(Tax $tax)
    {
        $this->authorize('view', $tax);

        return new TaxResource($tax);
    }

    public function update(TaxUpdateRequest $request, Tax $tax)
    {
        $this->authorize('update', $tax);

        $updated = $this->service->update($tax->id, $request->validated());
        return new TaxResource($updated);
    }

    public function destroy(Tax $tax)
    {
        $this->authorize('delete', $tax);

        $this->service->delete($tax->id);
        return response()->noContent();
    }
}