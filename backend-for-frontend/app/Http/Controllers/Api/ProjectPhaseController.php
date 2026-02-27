<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectPhase;
use App\Models\Project;
use App\Services\ProjectPhaseService;
use App\Http\Resources\ProjectPhaseResource;
use App\Http\Requests\ProjectPhaseStoreRequest;
use App\Http\Requests\ProjectPhaseUpdateRequest;
use App\Services\CommonService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectPhaseResource::collection($data);
    }

    public function store(ProjectPhaseStoreRequest $request)
    {
        $this->authorize('create', ProjectPhase::class);
        
        $validated = $request->validated();
        
        // Check if adding a new phase would exceed the project's no_of_phases limit
        $project = Project::findOrFail($validated['project_id']);
        $currentPhaseCount = ProjectPhase::where('project_id', $validated['project_id'])->count();
        
        if ($project->no_of_phases && $currentPhaseCount >= $project->no_of_phases) {
            return response()->json([
                'error' => "Cannot add more phases. Project is limited to {$project->no_of_phases} phase(s) and {$currentPhaseCount} phase(s) already exist."
            ], 422);
        }
        
        do {
            $commonService = new CommonService();
            $code = $commonService->generateUniqueCode('PRP-');
        } while (ProjectPhase::where('code', $code)->exists());
        
        $validated['code'] = $code;
        $validated['created_by'] = Auth::id();
        $validated['quote_item_id'] = null;
        $validated['start_date'] = is_null($validated['start_date']) ? new \DateTime() : $validated['start_date'];
        $validated['end_date'] = is_null($validated['end_date']) ? new \DateTime() : $validated['end_date'];
        
        $model = $this->service->create($validated);
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