<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Services\ProjectService;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;

class ProjectController extends Controller
{
    protected $service;

    public function __construct(ProjectService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return ProjectResource::collection($data);
    }

    public function store(ProjectStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectResource($model);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);

        return new ProjectResource($project);
    }

    public function update(ProjectUpdateRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $updated = $this->service->update($project->id, $request->validated());
        return new ProjectResource($updated);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->delete($project->id);
        return response()->noContent();
    }
}