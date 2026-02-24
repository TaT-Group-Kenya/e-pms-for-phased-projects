<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyProject;
use App\Models\Company;
use App\Services\CompanyProjectService;
use App\Http\Resources\CompanyProjectResource;
use App\Http\Requests\CompanyProjectStoreRequest;
use App\Http\Requests\CompanyProjectUpdateRequest;

use Illuminate\Support\Facades\Auth;

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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyProjectResource::collection($data);
    }

    public function store(CompanyProjectStoreRequest $request)
    {
        $this->authorize('create', Company::class);

        try {
            $validated = $request->validated();
            $validated['created_by'] = Auth::id();
            $validated['created_at'] = now();
            $validated['updated_at'] = now();

            $model = $this->service->create($validated);
            return new CompanyProjectResource($model);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ], $e->getCode() ?: 400);
        }
    }

    public function show(CompanyProject $companyProject)
    {
        $this->authorize('view', $companyProject);

        return new CompanyProjectResource($companyProject);
    }

    public function update(CompanyProjectUpdateRequest $request, CompanyProject $companyProject)
    {
        $this->authorize('update', $companyProject);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();


        $updated = $this->service->update($companyProject->id, $validated);
        return new CompanyProjectResource($updated);
    }

    public function destroy(CompanyProject $companyProject)
    {
        $this->authorize('delete', $companyProject);

        $this->service->delete($companyProject->id);
        return response()->noContent();
    }
}