<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectSourceOrigin;
use App\Services\ProjectSourceOriginService;
use App\Http\Resources\ProjectSourceOriginResource;
use App\Http\Requests\ProjectSourceOriginStoreRequest;
use App\Http\Requests\ProjectSourceOriginUpdateRequest;

class ProjectSourceOriginController extends Controller
{
    protected $service;

    public function __construct(ProjectSourceOriginService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', ProjectSourceOrigin::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectSourceOriginResource::collection($data);
    }

    public function store(ProjectSourceOriginStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectSourceOriginResource($model);
    }

    public function show(ProjectSourceOrigin $projectSourceOrigin)
    {
        $this->authorize('view', $projectSourceOrigin);

        return new ProjectSourceOriginResource($projectSourceOrigin);
    }

    public function update(ProjectSourceOriginUpdateRequest $request, ProjectSourceOrigin $projectSourceOrigin)
    {
        $this->authorize('update', $projectSourceOrigin);

        $updated = $this->service->update($projectSourceOrigin->id, $request->validated());
        return new ProjectSourceOriginResource($updated);
    }

    public function destroy(ProjectSourceOrigin $projectSourceOrigin)
    {
        $this->authorize('delete', $projectSourceOrigin);

        $this->service->delete($projectSourceOrigin->id);
        return response()->noContent();
    }
}
