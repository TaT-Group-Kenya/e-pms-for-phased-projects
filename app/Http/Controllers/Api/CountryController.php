<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return CountryResource::collection($data);
    }

    public function store(CountryStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($country->id, $request->validated());
        return new CountryResource($updated);
    }

    public function destroy(Country $country)
    {
        $this->authorize('delete', $country);

        $this->service->delete($country->id);
        return response()->noContent();
    }
}