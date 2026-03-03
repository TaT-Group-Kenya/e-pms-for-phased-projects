<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyInvoiceTaxItem;
use App\Models\Tax;
use App\Services\CompanyInvoiceTaxItemService;
use App\Http\Resources\CompanyInvoiceTaxItemResource;
use App\Http\Requests\CompanyInvoiceTaxItemStoreRequest;
use App\Http\Requests\CompanyInvoiceTaxItemUpdateRequest;

class CompanyInvoiceTaxItemController extends Controller
{
    protected $service;

    public function __construct(CompanyInvoiceTaxItemService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoiceTaxItem::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyInvoiceTaxItemResource::collection($data);
    }

    public function store(CompanyInvoiceTaxItemStoreRequest $request)
    {
        $this->authorize('create', \App\Models\CompanyInvoiceTaxItem::class);
        $validated = $request->validated();
        $taxId = $validated['tax_id'] ?? null;

        // Enforce unique tax per invoice: no duplicate tax (by tax_id) on the same invoice
        if (!empty($validated['invoice_id']) && !empty($taxId)) {
            $exists = CompanyInvoiceTaxItem::where('invoice_id', $validated['invoice_id'])
                ->where('tax_id', $taxId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the invoice.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this invoice.'],
                    ],
                ], 422);
            }
        }

        if ($taxId) {
            $tax = Tax::findOrFail($taxId);
            $validated['item_name'] = $tax->name;
        }
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CompanyInvoiceTaxItemResource($model);
    }

    public function show(CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('view', $companyInvoiceTaxItem);

        return new CompanyInvoiceTaxItemResource($companyInvoiceTaxItem);
    }

    public function update(CompanyInvoiceTaxItemUpdateRequest $request, CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('update', $companyInvoiceTaxItem);

        $validated = $request->validated();
        $taxId = array_key_exists('tax_id', $validated)
            ? $validated['tax_id']
            : $companyInvoiceTaxItem->tax_id;

        $invoiceId = $validated['invoice_id'] ?? $companyInvoiceTaxItem->invoice_id;

        // Enforce unique tax per invoice on update as well (by tax_id)
        if (!empty($invoiceId) && !empty($taxId)) {
            $exists = CompanyInvoiceTaxItem::where('invoice_id', $invoiceId)
                ->where('tax_id', $taxId)
                ->where('id', '!=', $companyInvoiceTaxItem->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'This tax has already been added to the invoice.',
                    'errors' => [
                        'tax_id' => ['A tax item with this tax has already been added to this invoice.'],
                    ],
                ], 422);
            }
        }

        if (array_key_exists('tax_id', $validated) && $validated['tax_id']) {
            $tax = Tax::findOrFail($validated['tax_id']);
            $validated['item_name'] = $tax->name;
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyInvoiceTaxItem->id, $validated);
        return new CompanyInvoiceTaxItemResource($updated);
    }

    public function destroy(CompanyInvoiceTaxItem $companyInvoiceTaxItem)
    {
        $this->authorize('delete', $companyInvoiceTaxItem);

        $this->service->delete($companyInvoiceTaxItem->id);
        return response()->noContent();
    }
}