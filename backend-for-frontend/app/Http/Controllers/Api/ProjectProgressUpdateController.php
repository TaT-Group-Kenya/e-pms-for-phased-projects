<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectProgressUpdate;
use App\Services\ProjectProgressUpdateService;
use App\Http\Resources\ProjectProgressUpdateResource;
use App\Http\Requests\ProjectProgressUpdateStoreRequest;
use App\Http\Requests\ProjectProgressUpdateUpdateRequest;

class ProjectProgressUpdateController extends Controller
{
    protected $service;

    public function __construct(ProjectProgressUpdateService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\ProjectProgressUpdate::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return ProjectProgressUpdateResource::collection($data);
    }

    public function store(ProjectProgressUpdateStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new ProjectProgressUpdateResource($model);
    }

    public function show(ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('view', $projectProgressUpdate);

        return new ProjectProgressUpdateResource($projectProgressUpdate);
    }

    public function update(ProjectProgressUpdateUpdateRequest $request, ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('update', $projectProgressUpdate);

        $updated = $this->service->update($projectProgressUpdate->id, $request->validated());
        return new ProjectProgressUpdateResource($updated);
    }

    public function destroy(ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('delete', $projectProgressUpdate);

        $this->service->delete($projectProgressUpdate->id);
        return response()->noContent();
    }
}