<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyProject;
use App\Services\CompanyProjectService;
use App\Http\Resources\CompanyProjectResource;
use App\Http\Requests\CompanyProjectStoreRequest;
use App\Http\Requests\CompanyProjectUpdateRequest;

class CompanyProjectController extends Controller
{
    protected $service;

    public function __construct(CompanyProjectService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyProject::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return CompanyProjectResource::collection($data);
    }

    public function store(CompanyProjectStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyProjectResource($model);
    }

    public function show(CompanyProject $companyProject)
    {
        $this->authorize('view', $companyProject);

        return new CompanyProjectResource($companyProject);
    }

    public function update(CompanyProjectUpdateRequest $request, CompanyProject $companyProject)
    {
        $this->authorize('update', $companyProject);

        $updated = $this->service->update($companyProject->id, $request->validated());
        return new CompanyProjectResource($updated);
    }

    public function destroy(CompanyProject $companyProject)
    {
        $this->authorize('delete', $companyProject);

        $this->service->delete($companyProject->id);
        return response()->noContent();
    }
}