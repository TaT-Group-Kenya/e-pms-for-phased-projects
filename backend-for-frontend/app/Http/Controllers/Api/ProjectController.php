<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Http\Resources\ProjectResource;
use App\Models\CompanyPayment;
use App\Models\CustPayment;
use App\Models\Order;
use App\Models\Project;
use App\Services\CommonService;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected $service;

    public function __construct(ProjectService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Project::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        // Eager load customer and projectOwner for project listings to avoid N+1 queries
        $data = $this->service->index($filters, $perPage, $page, 0);
        $data->load(['customer', 'order', 'creator', 'projectOwner']);

        return ProjectResource::collection($data);
    }

    public function store(ProjectStoreRequest $request)
    {
        $this->authorize('create', Project::class);

        $validated = $request->validated();

        // Ensure the project customer matches the customer on the related order
        $order = Order::findOrFail($validated['order_id']);
        if ((int) $validated['customer_id'] !== (int) $order->customer_id) {
            return response()->json([
                'message' => 'The project customer must be the same as the order customer.',
                'errors' => [
                    'customer_id' => ['The selected customer does not match the order customer.'],
                ],
            ], 422);
        }

        // Set bol_number from order if present
        if (isset($order->bol_number)) {
            $validated['bol_number'] = $order->bol_number;
        }

        do {
            $commonService = new CommonService;
            $code = $commonService->generateUniqueCode('PRJ-');
        } while (Project::where('code', $code)->exists());

        $validated['code'] = $code;
        $validated['created_by'] = Auth::id();
        $validated['created_at'] = $validated['created_at'] ?? now();
        $validated['quote_item_id'] = null;
        $validated['start_date'] = is_null($validated['start_date']) ? new \DateTime : $validated['start_date'];
        $validated['end_date'] = is_null($validated['end_date']) ? new \DateTime : $validated['end_date'];

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
            'order.shipContainer.numbers',
            'customer_invoice',
            'company_invoices',
            'projectOwner',
        ]);

        // Fetch incoming payments from customer invoices
        $incomingPayments = [];
        if ($project->customer_invoice) {
            $invoice = $project->customer_invoice;

            $incomingPayments = CustPayment::whereHas('allocations', function ($query) use ($invoice) {
                $query->where('invoice_id', $invoice->id);
            })->where('payment_type', 'normal')->with('allocations')->get();
        }

        // Fetch outgoing payments from company invoices
        $outgoingPayments = [];
        if ($project->company_invoices && count($project->company_invoices) > 0) {
            $invoiceIds = $project->company_invoices->pluck('id')->toArray();
            $outgoingPayments = CompanyPayment::with(['invoice.company'])->where('payment_type', 'normal')->whereIn('invoice_id', $invoiceIds)->get();
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
        $validated['created_at'] = $validated['created_at'] ?? $project->created_at;
        $validated['updated_at'] = $validated['updated_at'] ?? now();

        if (($validated['status'] ?? null) === 'complete' && $project->phases()->where(function ($query) {
            $query->whereNull('entry_number')->orWhereRaw("TRIM(entry_number) = ''");
        })->exists()) {
            return response()->json([
                'message' => 'Every project phase needs an entry number before the project can be completed.',
                'errors' => ['status' => ['A project phase is missing its entry number.']],
            ], 422);
        }

        // If this project is linked to an order, prevent changing the customer
        // to anything other than the order's customer
        $project->loadMissing('order');
        if ($project->order && array_key_exists('customer_id', $validated)) {
            if ((int) $validated['customer_id'] !== (int) $project->order->customer_id) {
                return response()->json([
                    'message' => 'The project customer must match the customer on the related order.',
                    'errors' => [
                        'customer_id' => ['The selected customer does not match the order customer.'],
                    ],
                ], 422);
            }
        }

        $updated = $this->service->update($project->id, $validated);

        // If project status is being changed, update all project phases status
        if (isset($validated['status']) && $validated['status'] !== $project->status) {
            $updated->phases()->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
                'updated_at' => now(),
            ]);
        }

        return new ProjectResource($updated);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $this->service->delete($project->id, Auth::id());

        return response()->noContent();
    }
}
