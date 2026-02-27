<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Country;
use App\Services\CountryService;
use App\Http\Resources\CountryResource;
use App\Http\Requests\CountryStoreRequest;
use App\Http\Requests\CountryUpdateRequest;

class CountryController extends Controller
{
    protected $service;

    public function __construct(CountryService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Country::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CountryResource::collection($data);
    }

    public function store(CountryStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CountryResource($model);
    }

    public function show(Country $country)
    {
        $this->authorize('view', $country);

        return new CountryResource($country);
    }

    public function update(CountryUpdateRequest $request, Country $country)
    {
        $this->authorize('update', $country);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($country->id, $validated);
        return new CountryResource($updated);
    }

    public function destroy(Country $country)
    {
        $this->authorize('delete', $country);

        $this->service->delete($country->id);
        return response()->noContent();
    }
}