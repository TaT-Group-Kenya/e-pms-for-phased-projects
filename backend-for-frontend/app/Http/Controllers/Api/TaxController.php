<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return TaxResource::collection($data);
    }

    public function store(TaxStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($tax->id, $validated);
        return new TaxResource($updated);
    }

    public function destroy(Tax $tax)
    {
        $this->authorize('delete', $tax);

        $this->service->delete($tax->id);
        return response()->noContent();
    }
}