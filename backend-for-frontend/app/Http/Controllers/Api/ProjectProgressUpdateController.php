<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProjectProgressUpdate;
use App\Models\ProjectPhase;
use App\Models\Project;
use App\Models\CompanyProject;
use App\Services\ProjectProgressUpdateService;
use App\Http\Resources\ProjectProgressUpdateResource;
use App\Http\Requests\ProjectProgressUpdateStoreRequest;
use App\Http\Requests\ProjectProgressUpdateUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProjectProgressUpdateController extends Controller
{
    protected $service;

    public function __construct(ProjectProgressUpdateService $service) {
        $this->service = $service;
    }

    /**
     * Calculate and update the parent project's progress based on its phases' progress.
     * 
     * If project has 1 phase: project.progress = phase.progress_percentage
     * If project has N phases: project.progress = average of all phases' progress_percentage
     * 
     * Also updates project status:
     * - To "progress" if it's "draft" or "new"
     * - To "complete" if progress reaches 100
     * 
     * Also marks CompanyProject records as complete when project is complete.
     * 
     * @param int $projectId
     */
    private function calculateAndUpdateProjectProgress($projectId)
    {
        // Get all phases for this project
        $phases = ProjectPhase::where('project_id', $projectId)->get();
        
        if ($phases->isEmpty()) {
            return;
        }
        
        // Calculate average progress across all phases
        $totalProgress = $phases->sum('progress_percentage');
        $phaseCount = $phases->count();
        $projectProgress = $phaseCount > 0 ? ($totalProgress / $phaseCount) : 0;
        
        // Get current project to check status
        $project = Project::find($projectId);
        $newStatus = $project->status;
        
        // Update status to "progress" if currently draft or new
        if (in_array($project->status, ['draft', 'new'], true)) {
            $newStatus = 'progress';
        }
        
        // Mark project as complete if progress reaches 100
        if ($projectProgress >= 100) {
            $newStatus = 'complete';
        }
        
        // Update the project progress and status
        Project::where('id', $projectId)->update([
            'progress' => $projectProgress,
            'status' => $newStatus,
            'updated_by' => Auth::id(),
            'updated_at' => now(),
        ]);
        
        // If project is now complete, mark all associated CompanyProject records as complete
        if ($newStatus === 'complete') {
            CompanyProject::where('project_id', $projectId)->update([
                'is_complete' => true,
                'updated_by' => Auth::id(),
                'updated_at' => now(),
            ]);
        }
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', ProjectProgressUpdate::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return ProjectProgressUpdateResource::collection($data);
    }

    public function store(ProjectProgressUpdateStoreRequest $request)
    {
        $this->authorize('create', ProjectProgressUpdate::class);

        return DB::transaction(function () use ($request) {
            $validated = $request->validated();
            
            // Get the project and phase
            $project = Project::find($validated['project_id']);
            $phase = ProjectPhase::find($validated['project_phase_id']);
            
            // Validation: Project must exist
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found',
                    'error_code' => 'PROJECT_NOT_FOUND'
                ], 404);
            }
            
            // Validation: Phase must exist
            if (!$phase) {
                return response()->json([
                    'message' => 'Project phase not found',
                    'error_code' => 'PHASE_NOT_FOUND'
                ], 404);
            }
            
            // Validation: Project cannot be in draft status
            if ($project->status === 'draft') {
                return response()->json([
                    'message' => 'Cannot add progress updates to projects in draft status. Project must be in new or progress status.',
                    'error_code' => 'PROJECT_DRAFT_STATUS'
                ], 422);
            }
            
            // Validation: Project cannot be complete
            if ($project->status === 'complete') {
                return response()->json([
                    'message' => 'Cannot add progress updates to completed projects.',
                    'error_code' => 'PROJECT_COMPLETE'
                ], 422);
            }
            
            // Validation: Phase cannot be in draft status
            if ($phase->status === 'draft') {
                return response()->json([
                    'message' => 'Cannot add progress updates to phases in draft status.',
                    'error_code' => 'PHASE_DRAFT_STATUS'
                ], 422);
            }
            
            // Validation: Phase cannot be complete
            if ($phase->status === 'complete') {
                return response()->json([
                    'message' => 'Cannot add progress updates to completed phases.',
                    'error_code' => 'PHASE_COMPLETE'
                ], 422);
            }
            
            // Create the progress update
            $validated['created_by'] = Auth::id();
            $validated['created_at'] = now();
            $validated['updated_at'] = now();
            $model = $this->service->create($validated);
            
            // Update the ProjectPhase progress_percentage
            if ($model->project_phase_id) {
                $phaseStatus = $phase->status;
                
                // Update phase status to "progress" if it's new or not yet started
                if (in_array($phase->status, ['new', 'pending'], true)) {
                    $phaseStatus = 'progress';
                }
                
                // Check if phase should be marked complete
                $phaseProgress = (float) $validated['percentage_complete'];
                if ($phaseProgress >= 100) {
                    $phaseStatus = 'complete';
                }
                
                // Update phase with new progress and status
                ProjectPhase::where('id', $model->project_phase_id)->update([
                    'progress_percentage' => $validated['percentage_complete'],
                    'status' => $phaseStatus,
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                ]);
                
                // If phase is now complete, mark associated CompanyProject records as complete
                if ($phaseStatus === 'complete') {
                    CompanyProject::where('project_id', $phase->project_id)
                        ->where('phase_id', $model->project_phase_id)
                        ->update([
                            'is_complete' => true,
                            'updated_by' => Auth::id(),
                            'updated_at' => now(),
                        ]);
                }
                
                // Get the project_id from the phase and update project progress
                if ($phase->project_id) {
                    $this->calculateAndUpdateProjectProgress($phase->project_id);
                }
            }
            
            return new ProjectProgressUpdateResource($model);
        });
    }

    public function show(ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('view', $projectProgressUpdate);

        return new ProjectProgressUpdateResource($projectProgressUpdate);
    }

    public function update(ProjectProgressUpdateUpdateRequest $request, ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('update', $projectProgressUpdate);

        return DB::transaction(function () use ($request, $projectProgressUpdate) {
            $validated = $request->validated();
            
            // Get the project and phase
            $project = Project::find($projectProgressUpdate->project_id);
            $phase = ProjectPhase::find($projectProgressUpdate->project_phase_id);
            
            // Validation: Project must exist
            if (!$project) {
                return response()->json([
                    'message' => 'Project not found',
                    'error_code' => 'PROJECT_NOT_FOUND'
                ], 404);
            }
            
            // Validation: Phase must exist
            if (!$phase) {
                return response()->json([
                    'message' => 'Project phase not found',
                    'error_code' => 'PHASE_NOT_FOUND'
                ], 404);
            }
            
            // Validation: Project cannot be in draft status
            if ($project->status === 'draft') {
                return response()->json([
                    'message' => 'Cannot update progress on projects in draft status.',
                    'error_code' => 'PROJECT_DRAFT_STATUS'
                ], 422);
            }
            
            // Validation: Project cannot be complete
            if ($project->status === 'complete') {
                return response()->json([
                    'message' => 'Cannot update progress on completed projects.',
                    'error_code' => 'PROJECT_COMPLETE'
                ], 422);
            }
            
            // Validation: Phase cannot be in draft status
            if ($phase->status === 'draft') {
                return response()->json([
                    'message' => 'Cannot update progress on phases in draft status.',
                    'error_code' => 'PHASE_DRAFT_STATUS'
                ], 422);
            }
            
            // Validation: Phase cannot be complete
            if ($phase->status === 'complete') {
                return response()->json([
                    'message' => 'Cannot update progress on completed phases.',
                    'error_code' => 'PHASE_COMPLETE'
                ], 422);
            }
            
            $validated['updated_by'] = Auth::id();
            $validated['updated_at'] = now();

            $updated = $this->service->update($projectProgressUpdate->id, $validated);
            
            // Update the ProjectPhase progress_percentage
            if ($updated->project_phase_id) {
                $phaseStatus = $phase->status;
                
                // Update phase status to "progress" if it's new or pending
                if (in_array($phase->status, ['new', 'pending'], true)) {
                    $phaseStatus = 'progress';
                }
                
                // Check if phase should be marked complete
                $phaseProgress = (float) $validated['percentage_complete'];
                if ($phaseProgress >= 100) {
                    $phaseStatus = 'complete';
                }
                
                // Update phase with new progress and status
                ProjectPhase::where('id', $updated->project_phase_id)->update([
                    'progress_percentage' => $validated['percentage_complete'],
                    'status' => $phaseStatus,
                    'updated_by' => Auth::id(),
                    'updated_at' => now(),
                ]);
                
                // If phase is now complete, mark associated CompanyProject records as complete
                if ($phaseStatus === 'complete') {
                    CompanyProject::where('project_id', $phase->project_id)
                        ->where('phase_id', $updated->project_phase_id)
                        ->update([
                            'is_complete' => true,
                            'updated_by' => Auth::id(),
                            'updated_at' => now(),
                        ]);
                }
                
                // Get the project_id from the phase and update project progress
                if ($phase->project_id) {
                    $this->calculateAndUpdateProjectProgress($phase->project_id);
                }
            }
            
            return new ProjectProgressUpdateResource($updated);
        });
    }

    public function destroy(ProjectProgressUpdate $projectProgressUpdate)
    {
        $this->authorize('delete', $projectProgressUpdate);

        $this->service->delete($projectProgressUpdate->id);
        return response()->noContent();
    }
}