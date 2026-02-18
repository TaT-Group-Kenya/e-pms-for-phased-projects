<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Services\CompanyService;
use App\Http\Resources\CompanyResource;
use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;

class CompanyController extends Controller
{
    protected $service;

    public function __construct(CompanyService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Company::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyResource::collection($data);
    }

    public function store(CompanyStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyResource($model);
    }

    public function show(Company $company)
    {
        $this->authorize('view', $company);

        return new CompanyResource($company);
    }

    public function update(CompanyUpdateRequest $request, Company $company)
    {
        $this->authorize('update', $company);

        $updated = $this->service->update($company->id, $request->validated());
        return new CompanyResource($updated);
    }

    public function destroy(Company $company)
    {
        $this->authorize('delete', $company);

        $this->service->delete($company->id);
        return response()->noContent();
    }
}