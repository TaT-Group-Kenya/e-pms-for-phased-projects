<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuoteApproval;
use App\Models\Quotation;
use App\Services\QuoteApprovalService;
use App\Http\Resources\QuoteApprovalResource;
use App\Http\Requests\QuoteApprovalStoreRequest;
use App\Http\Requests\QuoteApprovalUpdateRequest;

class QuoteApprovalController extends Controller
{
    protected $service;

    public function __construct(QuoteApprovalService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', QuoteApproval::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuoteApprovalResource::collection($data);
    }

    public function store(QuoteApprovalStoreRequest $request)
    {
        $this->authorize('create', QuoteApproval::class);
        
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();

        // Ensure approvals are only recorded for quotations in sent status
        $quotation = Quotation::with('approvals')->find($validated['quote_id']);
        if (!$quotation) {
            return response()->json([
                'message' => 'Quotation not found for approval.',
                'errors' => [
                    'quote_id' => ['The selected quotation does not exist.'],
                ],
            ], 422);
        }

        if ($quotation->status !== 'sent') {
            return response()->json([
                'message' => 'Approvals can only be added when the quotation is in sent status.',
                'errors' => [
                    'status' => ['Quotation must be in sent status to record approvals.'],
                ],
            ], 422);
        }

        $model = $this->service->create($validated);

        // Reload approvals including the newly created one
        $quotation->load('approvals');

        $minApprovalCount = (int) ($quotation->min_approval_count ?? 0);
        $approvals = $quotation->approvals;
        $approvalCount = $approvals->count();
        $hasMake = $approvals->contains(function (QuoteApproval $approval) {
            return $approval->action === 'make';
        });
        $hasCheck = $approvals->contains(function (QuoteApproval $approval) {
            return $approval->action === 'check';
        });

        $shouldMarkApproved = false;

        if ($minApprovalCount <= 1) {
            // Only one approval required, no specific role combination enforced
            $shouldMarkApproved = $approvalCount >= 1;
        } else {
            // Require at least min_approval_count and both maker and checker approvals
            $shouldMarkApproved = $approvalCount >= $minApprovalCount && $hasMake && $hasCheck;
        }

        if ($shouldMarkApproved && $quotation->status !== 'approved') {
            $quotation->status = 'approved';
            $quotation->updated_by = Auth::id();
            $quotation->save();
        }

        return new QuoteApprovalResource($model);
    }

    public function show(QuoteApproval $quoteApproval)
    {
        $this->authorize('view', $quoteApproval);

        return new QuoteApprovalResource($quoteApproval);
    }

    public function update(QuoteApprovalUpdateRequest $request, QuoteApproval $quoteApproval)
    {
        $this->authorize('update', $quoteApproval);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($quoteApproval->id, $validated);
        return new QuoteApprovalResource($updated);
    }

    public function destroy(QuoteApproval $quoteApproval)
    {
        $this->authorize('delete', $quoteApproval);

        $this->service->delete($quoteApproval->id);
        return response()->noContent();
    }
}
