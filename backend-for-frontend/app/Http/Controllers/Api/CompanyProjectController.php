<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyProject;
use App\Models\Company;
use App\Models\ProjectProgressUpdate;
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
        $with = ['project', 'phase', 'company'];
        $data = $this->service->index($filters, $perPage, $page, 0, $with);
        return CompanyProjectResource::collection($data);
    }

    public function store(CompanyProjectStoreRequest $request)
    {
        $this->authorize('create', Company::class);

        try {
            $validated = $request->validated();
            
            // Check if a record with the same project_id and phase_id already exists
            $existingRecord = CompanyProject::where('project_id', $validated['project_id'])
                ->where('phase_id', $validated['phase_id'])
                ->first();
            
            // Check if there are any progress updates for this project phase
            $progressUpdates = ProjectProgressUpdate::where('project_id', $validated['project_id'])
                ->where('project_phase_id', $validated['phase_id'])
                ->exists();
            
            // If progress updates exist and we're trying to assign to a different company, reject
            if ($progressUpdates && $existingRecord && $existingRecord->company_id !== $validated['company_id']) {
                return response()->json([
                    'error' => 'Cannot reassign this project phase to another company because progress updates have already been recorded. This phase has existing progress history that must remain with the current assignment.',
                    'code' => 'PHASE_HAS_PROGRESS_UPDATES'
                ], 422);
            }
            
            // If exists and is_complete is false, update the existing record with new company_id
            if ($existingRecord && !$existingRecord->is_complete) {
                // If progress updates exist, only allow updating if it's the same company
                if ($progressUpdates && $existingRecord->company_id !== $validated['company_id']) {
                    return response()->json([
                        'error' => 'Cannot reassign this project phase to another company because progress updates have already been recorded.',
                        'code' => 'PHASE_HAS_PROGRESS_UPDATES'
                    ], 422);
                }
                
                $validated['updated_by'] = Auth::id();
                $validated['updated_at'] = now();
                
                $model = $this->service->update($existingRecord->id, $validated);
                return new CompanyProjectResource($model);
            }
            
            // Otherwise create a new record
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