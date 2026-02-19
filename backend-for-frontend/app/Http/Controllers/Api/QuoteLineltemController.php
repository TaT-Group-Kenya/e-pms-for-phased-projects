<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return QuoteLineltemResource::collection($data);
    }

    public function store(QuoteLineltemStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($quoteLineltem->id, $request->validated());
        return new QuoteLineltemResource($updated);
    }

    public function destroy(QuoteLineltem $quoteLineltem)
    {
        $this->authorize('delete', $quoteLineltem);

        $this->service->delete($quoteLineltem->id);
        return response()->noContent();
    }
}