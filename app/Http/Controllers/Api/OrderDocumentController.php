<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return OrderDocumentResource::collection($data);
    }

    public function store(OrderDocumentStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($orderDocument->id, $request->validated());
        return new OrderDocumentResource($updated);
    }

    public function destroy(OrderDocument $orderDocument)
    {
        $this->authorize('delete', $orderDocument);

        $this->service->delete($orderDocument->id);
        return response()->noContent();
    }
}