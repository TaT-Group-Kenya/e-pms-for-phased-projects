<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuoteDocumentResource::collection($data);
    }

    public function store(QuoteDocumentStoreRequest $request)
    {
        $this->authorize('create', \App\Models\QuoteDocument::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($quoteDocument->id, $validated);
        return new QuoteDocumentResource($updated);
    }

    public function destroy(QuoteDocument $quoteDocument)
    {
        $this->authorize('delete', $quoteDocument);

        $this->service->delete($quoteDocument->id);
        return response()->noContent();
    }
}