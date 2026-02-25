<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Quotation;
use App\Services\QuotationService;
use App\Services\CommonService;
use App\Http\Resources\QuotationResource;
use App\Http\Requests\QuotationStoreRequest;
use App\Http\Requests\QuotationUpdateRequest;
use Illuminate\Validation\Rule;
use App\Models\Project;
use App\Models\QuoteLineItem;
use App\Models\ProjectPhase;
use App\Models\QuoteApproval;

class QuotationController extends Controller
{
    protected $service;

    public function __construct(QuotationService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Quotation::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuotationResource::collection($data);
    }

    public function store(QuotationStoreRequest $request)
    {
        $this->authorize('create', Quotation::class);
        $commonService = new CommonService();
        do {
            $quotationNumber = $commonService->generateUniqueCode('QUO-');
        }while (Quotation::where('quotation_number', $quotationNumber)->exists());
        
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $validated['quotation_number'] = $quotationNumber;
        $validated['description'] = $validated['description'] ?? $validated['title'];
        
        // Fetch and set currency from project if project_id is provided and currency is not set
        if (!empty($validated['project_id'])) {
            $project = Project::find($validated['project_id']);
            
            // Validate project status and phases
            if ($project) {
                if ($project->status === 'draft') {
                    return response()->json([
                        'message' => 'Cannot create quotations for draft projects',
                        'errors' => ['project_id' => ['The selected project is in draft status']]
                    ], 422);
                }
                
                if ($project->phases()->count() === 0) {
                    return response()->json([
                        'message' => 'Cannot create quotations for projects without phases',
                        'errors' => ['project_id' => ['The selected project has no phases']]
                    ], 422);
                }
                
                if (empty($validated['currency']) && !empty($project->currency)) {
                    $validated['currency'] = $project->currency;
                }

                // Enforce 1 project 1 quotation rule
                $existingQuotation = Quotation::where('project_id', $validated['project_id'])->first();
                if ($existingQuotation) {
                    return response()->json([
                        'message' => 'A quotation already exists for this project',
                        'errors' => [
                            'project_id' => ['Only one quotation is allowed per project.'],
                        ],
                    ], 422);
                }
            }
        }

        $model = $this->service->create($validated);
        
        // Automatically add quote items from project phases
        if (!empty($validated['project_id'])) {
            $phases = ProjectPhase::where('project_id', $validated['project_id'])->get();
            
            foreach ($phases as $phase) {
                // Create quote line item from project phase
                $quoteItem = QuoteLineItem::create([
                    'quotation_id' => $model->id,
                    'project_phase_id' => $phase->id,
                    'phase_name' => $phase->name,
                    'phase_description' => $phase->description,
                    'quoted_amount' => 0,
                    'quantity' => 1,
                    'estimated_hours' => null,
                    'custom_note' => null,
                    'is_taxable' => false,
                    'created_by' => Auth::id(),
                    'updated_by' => Auth::id(),
                    'created_at' => now()
                ]);
                
                // Link project phase to quote item
                $phase->update(['quote_item_id' => $quoteItem->id]);
            }
        }
        
        return new QuotationResource($model->load([
            'project',
            'customer',
            'quoteItems',
            'documents',
            'approvals',
            'order',
        ]));
    }

    public function show(Quotation $quotation)
    {
        $this->authorize('view', $quotation);

        return new QuotationResource($quotation->load([
            'project.phases',
            'customer',
            'quoteItems',
            'documents',
            'approvals.user',
            'order',
        ]));
    }

    public function update(QuotationUpdateRequest $request, Quotation $quotation)
    {
        $this->authorize('update', $quotation);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();

        $originalStatus = $quotation->status;
        $originalCustomerId = $quotation->customer_id;
        $originalProjectId = $quotation->project_id;

        // Once a quotation has an order, prevent further updates via this endpoint
        if ($quotation->order()->exists()) {
            return response()->json([
                'message' => 'Approved quotations with orders cannot be modified.',
                'errors' => [
                    'quotation' => ['Updates are disabled once an order has been generated.'],
                ],
            ], 422);
        }
        
        // Fetch and set currency from project if project_id is provided and currency is not set
        if (!empty($validated['project_id'])) {
            $project = Project::find($validated['project_id']);
            
            // Validate project status and phases
            if ($project) {
                if ($project->status === 'draft') {
                    return response()->json([
                        'message' => 'Cannot update quotations to draft projects',
                        'errors' => ['project_id' => ['The selected project is in draft status']]
                    ], 422);
                }
                
                if ($project->phases()->count() === 0) {
                    return response()->json([
                        'message' => 'Cannot update quotations to projects without phases',
                        'errors' => ['project_id' => ['The selected project has no phases']]
                    ], 422);
                }
                
                if (empty($validated['currency']) && !empty($project->currency)) {
                    $validated['currency'] = $project->currency;
                }

                // Enforce one quotation per project when changing the project
                $existingQuotation = Quotation::where('project_id', $validated['project_id'])
                    ->where('id', '!=', $quotation->id)
                    ->first();

                if ($existingQuotation) {
                    return response()->json([
                        'message' => 'A quotation already exists for this project',
                        'errors' => [
                            'project_id' => ['Only one quotation is allowed per project.'],
                        ],
                    ], 422);
                }
            }
        }

        // If quotation is currently sent, only allow status to be changed back to draft
        if ($originalStatus === 'sent') {
            $updatableKeys = array_keys($validated);
            $allowedKeys = ['status', 'updated_by'];
            $extraKeys = array_diff($updatableKeys, $allowedKeys);

            if (!empty($extraKeys)) {
                return response()->json([
                    'message' => 'Only the status can be changed for sent quotations, and only back to draft.',
                    'errors' => [
                        'status' => ['No other fields may be modified while the quotation is sent.'],
                    ],
                ], 422);
            }

            if (!array_key_exists('status', $validated) || $validated['status'] !== 'draft') {
                return response()->json([
                    'message' => 'Sent quotations can only be changed back to draft.',
                    'errors' => [
                        'status' => ['Status must be updated from sent to draft.'],
                    ],
                ], 422);
            }

            $updated = $this->service->update($quotation->id, [
                'status' => 'draft',
                'updated_by' => $validated['updated_by'],
            ]);

            // Clear all approvals when reverting to draft
            QuoteApproval::where('quote_id', $updated->id)->delete();

            // Ensure financial amounts are consistent with current line items
            $this->recalculateQuotationTotals($updated->id);

            return new QuotationResource($updated->loadMissing([
                'project.phases',
                'customer',
                'quoteItems',
                'documents',
                'approvals',
                'order',
            ]));
        }

        $updated = $this->service->update($quotation->id, $validated);

        // If customer or project changed while in draft, clear quote items and reset amounts
        if ($originalStatus === 'draft') {
            $customerChanged = array_key_exists('customer_id', $validated)
                && $validated['customer_id'] != $originalCustomerId;
            $projectChanged = array_key_exists('project_id', $validated)
                && $validated['project_id'] != $originalProjectId;

            if ($customerChanged || $projectChanged) {
                QuoteLineItem::where('quotation_id', $updated->id)->delete();

                $updated->subtotal_amount = 0;
                $updated->tax_amount = 0;
                $updated->discount_amount = 0;
                $updated->total_amount = 0;
                $updated->save();
            }
        }

        // When quotation is marked as sent, create a maker approval
        if (
            array_key_exists('status', $validated)
            && $validated['status'] === 'sent'
            && $originalStatus !== 'sent'
        ) {
            QuoteApproval::create([
                'user_id'    => Auth::id(),
                'quote_id'   => $updated->id,
                'action'     => 'make',
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);

            // Reload approvals so the response includes the new approval
            $updated->loadMissing('approvals');
        }

        // Ensure quotation amounts always match line items and percentages
        $this->recalculateQuotationTotals($updated->id);

        return new QuotationResource($updated->loadMissing([
            'project.phases',
            'customer',
            'quoteItems',
            'documents',
            'approvals',
            'order',
        ]));
    }

    public function destroy(Quotation $quotation)
    {
        $this->authorize('delete', $quotation);

        $this->service->delete($quotation->id);
        return response()->noContent();
    }

    /**
     * Recalculate quotation financial amounts from line items and percentages.
     */
    protected function recalculateQuotationTotals(int $quotationId): void
    {
        $quotation = Quotation::with('quoteItems')->find($quotationId);
        if (!$quotation) {
            return;
        }

        $subtotal = $quotation->quoteItems->sum(function (QuoteLineItem $item) {
            return (float) ($item->total ?? 0);
        });

        $taxPercentage = (float) ($quotation->tax_percentage ?? 0);
        $discountPercentage = (float) ($quotation->discount_percentage ?? 0);

        $taxAmount = $subtotal * ($taxPercentage / 100);
        $discountAmount = $subtotal * ($discountPercentage / 100);
        $totalAmount = $subtotal + $taxAmount - $discountAmount;

        $quotation->subtotal_amount = $subtotal;
        $quotation->tax_amount = $taxAmount;
        $quotation->discount_amount = $discountAmount;
        $quotation->total_amount = $totalAmount;

        $quotation->save();
    }
}