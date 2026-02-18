<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectPhase;
use App\Services\ProjectPhaseService;
use App\Http\Resources\ProjectPhaseResource;
use App\Http\Requests\ProjectPhaseStoreRequest;
use App\Http\Requests\ProjectPhaseUpdateRequest;

class ProjectPhaseController extends Controller
{
    protected $service;

    public function __construct(ProjectPhaseService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\ProjectPhase::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return ProjectPhaseResource::collection($data);
    }

    public function store(ProjectPhaseStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectPhaseResource($model);
    }

    public function show(ProjectPhase $projectPhase)
    {
        $this->authorize('view', $projectPhase);

        return new ProjectPhaseResource($projectPhase);
    }

    public function update(ProjectPhaseUpdateRequest $request, ProjectPhase $projectPhase)
    {
        $this->authorize('update', $projectPhase);

        $updated = $this->service->update($projectPhase->id, $request->validated());
        return new ProjectPhaseResource($updated);
    }

    public function destroy(ProjectPhase $projectPhase)
    {
        $this->authorize('delete', $projectPhase);

        $this->service->delete($projectPhase->id);
        return response()->noContent();
    }
}