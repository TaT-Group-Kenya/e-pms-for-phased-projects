<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuoteLineItem;
use App\Models\Quotation;
use App\Models\ProjectPhase;
use App\Services\QuoteLineItemService;
use App\Http\Resources\QuoteLineItemResource;
use App\Http\Requests\QuoteLineItemStoreRequest;
use App\Http\Requests\QuoteLineItemUpdateRequest;

class QuoteLineItemController extends Controller
{
    protected $service;

    public function __construct(QuoteLineItemService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', QuoteLineItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuoteLineItemResource::collection($data);
    }

    public function store(QuoteLineItemStoreRequest $request)
    {
        $validated = $request->validated();
        
        // Prevent creating line items when quotation is not in draft status
        if (!empty($validated['quotation_id'])) {
            $quotation = Quotation::find($validated['quotation_id']);
            if (!$quotation || $quotation->status !== 'draft') {
                return response()->json([
                    'message' => 'Line items can only be modified while the quotation is in draft status.',
                    'errors' => [
                        'quotation' => ['Cannot add line items for non-draft quotations.'],
                    ],
                ], 422);
            }

            // Enforce that line items cannot mix project phases from different projects
            if (!empty($validated['project_phase_id'])) {
                $phase = ProjectPhase::find($validated['project_phase_id']);
                if ($phase) {
                    if (empty($quotation->project_id)) {
                        return response()->json([
                            'message' => 'Cannot add project phases to a quotation without an associated project.',
                            'errors' => [
                                'project_phase_id' => ['Quotation must be linked to a project before adding project phases.'],
                            ],
                        ], 422);
                    }

                    if ((int) $phase->project_id !== (int) $quotation->project_id) {
                        return response()->json([
                            'message' => 'Line items cannot reference project phases from a different project than the quotation.',
                            'errors' => [
                                'project_phase_id' => ['Selected project phase does not belong to the quotation project.'],
                            ],
                        ], 422);
                    }
                }
            }
        }

        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();
        $model = $this->service->create($validated);

        if ($model->quotation_id) {
            $this->recalculateQuotationTotals($model->quotation_id);
        }

        return new QuoteLineItemResource($model);
    }

    public function show(QuoteLineItem $quoteLineItem)
    {
        $this->authorize('view', $quoteLineItem);

        return new QuoteLineItemResource($quoteLineItem);
    }

    public function update(QuoteLineItemUpdateRequest $request, QuoteLineItem $quoteLineItem)
    {
        $this->authorize('update', $quoteLineItem);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        // Prevent updating line items when quotation is not in draft status
        $quotation = $quoteLineItem->quotation ?: Quotation::find($quoteLineItem->quotation_id);
        if (!$quotation || $quotation->status !== 'draft') {
            return response()->json([
                'message' => 'Line items can only be modified while the quotation is in draft status.',
                'errors' => [
                    'quotation' => ['Cannot update line items for non-draft quotations.'],
                ],
            ], 422);
        }

        // Enforce that line items cannot mix project phases from different projects
        $projectPhaseId = $validated['project_phase_id'] ?? $quoteLineItem->project_phase_id;
        if (!empty($projectPhaseId)) {
            $phase = ProjectPhase::find($projectPhaseId);
            if ($phase) {
                if (empty($quotation->project_id)) {
                    return response()->json([
                        'message' => 'Cannot link project phases to a quotation without an associated project.',
                        'errors' => [
                            'project_phase_id' => ['Quotation must be linked to a project before adding project phases.'],
                        ],
                    ], 422);
                }

                if ((int) $phase->project_id !== (int) $quotation->project_id) {
                    return response()->json([
                        'message' => 'Line items cannot reference project phases from a different project than the quotation.',
                        'errors' => [
                            'project_phase_id' => ['Selected project phase does not belong to the quotation project.'],
                        ],
                    ], 422);
                }
            }
        }

        $updated = $this->service->update($quoteLineItem->id, $validated);

        if ($updated->quotation_id) {
            $this->recalculateQuotationTotals($updated->quotation_id);
        }

        return new QuoteLineItemResource($updated);
    }

    public function destroy(QuoteLineItem $quoteLineItem)
    {
        $this->authorize('delete', $quoteLineItem);

        // Prevent deleting line items when quotation is not in draft status
        $quotation = $quoteLineItem->quotation ?: Quotation::find($quoteLineItem->quotation_id);
        if (!$quotation || $quotation->status !== 'draft') {
            return response()->json([
                'message' => 'Line items can only be modified while the quotation is in draft status.',
                'errors' => [
                    'quotation' => ['Cannot delete line items for non-draft quotations.'],
                ],
            ], 422);
        }

        $quotationId = $quoteLineItem->quotation_id;

        $this->service->delete($quoteLineItem->id);

        if ($quotationId) {
            $this->recalculateQuotationTotals($quotationId);
        }
        return response()->noContent();
    }

    protected function recalculateQuotationTotals(int $quotationId): void
    {
        $quotation = Quotation::with('quoteItems')->find($quotationId);
        if (!$quotation) {
            return;
        }

        $subtotal = $quotation->quoteItems->sum(function (QuoteLineItem $item) {
            return (float) ($item->total ?? 0);
        });

        $discountPercentage = (float) ($quotation->discount_percentage ?? 0);

        // Tax amount is now managed independently of a header tax_percentage.
        $taxAmount = (float) ($quotation->tax_amount ?? 0);
        $discountAmount = $subtotal * ($discountPercentage / 100);
        $totalAmount = $subtotal + $taxAmount - $discountAmount;

        $quotation->subtotal_amount = $subtotal;
        $quotation->tax_amount = $taxAmount;
        $quotation->discount_amount = $discountAmount;
        $quotation->total_amount = $totalAmount;

        $quotation->save();
    }
}
