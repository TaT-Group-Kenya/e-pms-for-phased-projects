<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\QuoteDocument;
use App\Services\QuoteDocumentService;
use App\Http\Resources\QuoteDocumentResource;
use App\Http\Requests\QuoteDocumentStoreRequest;
use App\Http\Requests\QuoteDocumentUpdateRequest;

class QuoteDocumentController extends Controller
{
    protected $service;

    public function __construct(QuoteDocumentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\QuoteDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return QuoteDocumentResource::collection($data);
    }

    public function store(QuoteDocumentStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new QuoteDocumentResource($model);
    }

    public function show(QuoteDocument $quoteDocument)
    {
        $this->authorize('view', $quoteDocument);

        return new QuoteDocumentResource($quoteDocument);
    }

    public function update(QuoteDocumentUpdateRequest $request, QuoteDocument $quoteDocument)
    {
        $this->authorize('update', $quoteDocument);

        $updated = $this->service->update($quoteDocument->id, $request->validated());
        return new QuoteDocumentResource($updated);
    }

    public function destroy(QuoteDocument $quoteDocument)
    {
        $this->authorize('delete', $quoteDocument);

        $this->service->delete($quoteDocument->id);
        return response()->noContent();
    }
}