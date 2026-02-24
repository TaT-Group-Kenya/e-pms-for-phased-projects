<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Services\ProjectService;
use App\Http\Resources\ProjectResource;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectResource::collection($data);
    }

    public function store(ProjectStoreRequest $request)
    {
        $this->authorize('create', Project::class);
        
        $validated = $request->validated();
        
        do {
            $code = $this->service->generateUniquePhaseCode('PRJ-');
        } while (Project::where('code', $code)->exists());
        
        $validated['code'] = $code;
        $validated['created_by'] = Auth::id();
        $validated['quote_item_id'] = null;
        $validated['start_date'] = is_null($validated['start_date']) ? new \DateTime() : $validated['start_date'];
        $validated['end_date'] = is_null($validated['end_date']) ? new \DateTime() : $validated['end_date'];
        
        $model = $this->service->create($validated);
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

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        
        $updated = $this->service->update($project->id, $validated);
        return new ProjectResource($updated);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->delete($project->id);
        return response()->noContent();
    }
}