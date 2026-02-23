<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuoteLineltem;
use App\Services\QuoteLineltemService;
use App\Http\Resources\QuoteLineltemResource;
use App\Http\Requests\QuoteLineltemStoreRequest;
use App\Http\Requests\QuoteLineltemUpdateRequest;

class QuoteLineltemController extends Controller
{
    protected $service;

    public function __construct(QuoteLineltemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\QuoteLineltem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuoteLineltemResource::collection($data);
    }

    public function store(QuoteLineltemStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new QuoteLineltemResource($model);
    }

    public function show(QuoteLineltem $quoteLineltem)
    {
        $this->authorize('view', $quoteLineltem);

        return new QuoteLineltemResource($quoteLineltem);
    }

    public function update(QuoteLineltemUpdateRequest $request, QuoteLineltem $quoteLineltem)
    {
        $this->authorize('update', $quoteLineltem);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($quoteLineltem->id, $validated);
        return new QuoteLineltemResource($updated);
    }

    public function destroy(QuoteLineltem $quoteLineltem)
    {
        $this->authorize('delete', $quoteLineltem);

        $this->service->delete($quoteLineltem->id);
        return response()->noContent();
    }
}