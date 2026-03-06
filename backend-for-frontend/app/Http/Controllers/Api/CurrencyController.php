<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Currency;
use App\Services\CurrencyService;
use App\Http\Resources\CurrencyResource;
use App\Http\Requests\CurrencyStoreRequest;
use App\Http\Requests\CurrencyUpdateRequest;
use Illuminate\Support\Facades\Auth;

class CurrencyController extends Controller
{
    protected $service;

    public function __construct(CurrencyService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Currency::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CurrencyResource::collection($data);
    }

    public function store(CurrencyStoreRequest $request)
    {
        $this->authorize('create', \App\Models\Currency::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CurrencyResource($model);
    }

    public function show(Currency $currency)
    {
        $this->authorize('view', $currency);

        return new CurrencyResource($currency);
    }

    public function update(CurrencyUpdateRequest $request, Currency $currency)
    {
        $this->authorize('update', $currency);

        $updated = $this->service->update($currency->id, $request->validated());
        return new CurrencyResource($updated);
    }

    public function destroy(Currency $currency)
    {
        $this->authorize('delete', $currency);

        $this->service->delete($currency->id);
        return response()->noContent();
    }
}