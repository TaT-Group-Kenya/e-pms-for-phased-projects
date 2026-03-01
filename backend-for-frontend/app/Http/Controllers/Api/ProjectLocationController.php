<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectLocation;
use App\Services\ProjectLocationService;
use App\Http\Resources\ProjectLocationResource;
use App\Http\Requests\ProjectLocationStoreRequest;
use App\Http\Requests\ProjectLocationUpdateRequest;

class ProjectLocationController extends Controller
{
    protected $service;

    public function __construct(ProjectLocationService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', ProjectLocation::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectLocationResource::collection($data);
    }

    public function store(ProjectLocationStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectLocationResource($model);
    }

    public function show(ProjectLocation $projectLocation)
    {
        $this->authorize('view', $projectLocation);

        return new ProjectLocationResource($projectLocation);
    }

    public function update(ProjectLocationUpdateRequest $request, ProjectLocation $projectLocation)
    {
        $this->authorize('update', $projectLocation);

        $updated = $this->service->update($projectLocation->id, $request->validated());
        return new ProjectLocationResource($updated);
    }

    public function destroy(ProjectLocation $projectLocation)
    {
        $this->authorize('delete', $projectLocation);

        $this->service->delete($projectLocation->id);
        return response()->noContent();
    }
}
