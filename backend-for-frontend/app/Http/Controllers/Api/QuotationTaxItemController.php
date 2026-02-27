<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\QuotationTaxItem;
use App\Models\Tax;
use App\Services\QuotationTaxItemService;
use App\Http\Resources\QuotationTaxItemResource;
use App\Http\Requests\QuotationTaxItemStoreRequest;
use App\Http\Requests\QuotationTaxItemUpdateRequest;

class QuotationTaxItemController extends Controller
{
    protected $service;

    public function __construct(QuotationTaxItemService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', QuotationTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return QuotationTaxItemResource::collection($data);
    }

    public function store(QuotationTaxItemStoreRequest $request)
    {
        $this->authorize('create', QuotationTaxItem::class);
        $validated = $request->validated();
        $taxId = $validated['tax_id'] ?? null;

        if ($taxId) {
            $tax = Tax::findOrFail($taxId);
            $validated['item_name'] = $tax->name;
        }

        // Enforce unique tax per quotation: no duplicate tax (by tax_id) on the same quotation
        if (!empty($validated['quotation_id']) && !empty($taxId)) {
            $exists = QuotationTaxItem::where('quotation_id', $validated['quotation_id'])
                ->where('tax_id', $taxId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the quotation.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this quotation.'],
                    ],
                ], 422);
            }
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new QuotationTaxItemResource($model);
    }

    public function show(QuotationTaxItem $quotationTaxItem)
    {
        $this->authorize('view', $quotationTaxItem);

        return new QuotationTaxItemResource($quotationTaxItem);
    }

    public function update(QuotationTaxItemUpdateRequest $request, QuotationTaxItem $quotationTaxItem)
    {
        $this->authorize('update', $quotationTaxItem);

        $validated = $request->validated();
        $taxId = array_key_exists('tax_id', $validated)
            ? $validated['tax_id']
            : $quotationTaxItem->tax_id;

        if (!empty($validated['tax_id'])) {
            $tax = Tax::findOrFail($validated['tax_id']);
            $validated['item_name'] = $tax->name;
        }

        $quotationId = $validated['quotation_id'] ?? $quotationTaxItem->quotation_id;

        if (!empty($quotationId) && !empty($taxId)) {
            $exists = QuotationTaxItem::where('quotation_id', $quotationId)
                ->where('tax_id', $taxId)
                ->where('id', '!=', $quotationTaxItem->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the quotation.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this quotation.'],
                    ],
                ], 422);
            }
        }

        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($quotationTaxItem->id, $validated);
        return new QuotationTaxItemResource($updated);
    }

    public function destroy(QuotationTaxItem $quotationTaxItem)
    {
        $this->authorize('delete', $quotationTaxItem);

        $this->service->delete($quotationTaxItem->id);
        return response()->noContent();
    }
}
