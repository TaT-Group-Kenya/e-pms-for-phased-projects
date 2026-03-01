<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Services\ProjectService;
use App\Http\Resources\ProjectResource;
use App\Services\CommonService;
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
            $commonService = new CommonService();
            $code = $commonService->generateUniqueCode('PRJ-');
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

        // Eager load all relationships
        $project->load([
            'customer',
            'category',
            'sourceOrigin',
            'location',
            'phases.assignment.company',
            'order',
            'quotation',
            'customer_invoices',
            'company_invoices'
        ]);

        // Fetch incoming payments from customer invoices
        $incomingPayments = [];
        if ($project->customer_invoices && count($project->customer_invoices) > 0) {
            $invoiceIds = $project->customer_invoices->pluck('id')->toArray();
            $incomingPayments = \App\Models\CustPayment::whereHas('allocations', function ($query) use ($invoiceIds) {
                $query->whereIn('invoice_id', $invoiceIds);
            })->with('allocations')->get();
        }

        // Fetch outgoing payments from company invoices
        $outgoingPayments = [];
        if ($project->company_invoices && count($project->company_invoices) > 0) {
            $invoiceIds = $project->company_invoices->pluck('id')->toArray();
            $outgoingPayments = \App\Models\CompanyPayment::whereIn('invoice_id', $invoiceIds)->get();
        }

        // Attach payments to project
        $project->in_coming_payments = $incomingPayments;
        $project->out_going_payments = $outgoingPayments;

        return new ProjectResource($project);
    }

    public function update(ProjectUpdateRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        
        $updated = $this->service->update($project->id, $validated);
        
        // If project status is being changed, update all project phases status
        if (isset($validated['status']) && $validated['status'] !== $project->status) {
            $updated->phases()->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
                'updated_at' => now()
            ]);
        }
        
        return new ProjectResource($updated);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->delete($project->id);
        return response()->noContent();
    }
}