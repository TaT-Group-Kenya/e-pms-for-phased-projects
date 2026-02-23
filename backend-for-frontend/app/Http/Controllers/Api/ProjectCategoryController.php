<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectCategory;
use App\Services\ProjectCategoryService;
use App\Http\Resources\ProjectCategoryResource;
use App\Http\Requests\ProjectCategoryStoreRequest;
use App\Http\Requests\ProjectCategoryUpdateRequest;

class ProjectCategoryController extends Controller
{
    protected $service;

    public function __construct(ProjectCategoryService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\ProjectCategory::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectCategoryResource::collection($data);
    }

    public function store(ProjectCategoryStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectCategoryResource($model);
    }

    public function show(ProjectCategory $projectCategory)
    {
        $this->authorize('view', $projectCategory);

        return new ProjectCategoryResource($projectCategory);
    }

    public function update(ProjectCategoryUpdateRequest $request, ProjectCategory $projectCategory)
    {
        $this->authorize('update', $projectCategory);

        $updated = $this->service->update($projectCategory->id, $request->validated());
        return new ProjectCategoryResource($updated);
    }

    public function destroy(ProjectCategory $projectCategory)
    {
        $this->authorize('delete', $projectCategory);

        $this->service->delete($projectCategory->id);
        return response()->noContent();
    }
}