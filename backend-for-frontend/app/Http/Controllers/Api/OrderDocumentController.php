<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\OrderDocument;
use App\Services\OrderDocumentService;
use App\Http\Resources\OrderDocumentResource;
use App\Http\Requests\OrderDocumentStoreRequest;
use App\Http\Requests\OrderDocumentUpdateRequest;

class OrderDocumentController extends Controller
{
    protected $service;

    public function __construct(OrderDocumentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\OrderDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderDocumentResource::collection($data);
    }

    public function store(OrderDocumentStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new OrderDocumentResource($model);
    }

    public function show(OrderDocument $orderDocument)
    {
        $this->authorize('view', $orderDocument);

        return new OrderDocumentResource($orderDocument);
    }

    public function update(OrderDocumentUpdateRequest $request, OrderDocument $orderDocument)
    {
        $this->authorize('update', $orderDocument);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($orderDocument->id, $validated);
        return new OrderDocumentResource($updated);
    }

    public function destroy(OrderDocument $orderDocument)
    {
        $this->authorize('delete', $orderDocument);

        $this->service->delete($orderDocument->id);
        return response()->noContent();
    }
}