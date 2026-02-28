<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustCreditNote;
use App\Models\CustInvoice;
use App\Services\CustCreditNoteService;
use App\Http\Resources\CustCreditNoteResource;
use App\Http\Requests\CustCreditNoteStoreRequest;
use App\Http\Requests\CustCreditNoteUpdateRequest;

class CustCreditNoteController extends Controller
{
    protected $service;

    public function __construct(CustCreditNoteService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustCreditNote::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustCreditNoteResource::collection($data);
    }

    public function store(CustCreditNoteStoreRequest $request)
    {
        $validated = $request->validated();
        if (!empty($validated['invoice_id'])) {
            $invoice = CustInvoice::find($validated['invoice_id']);

            if (!$invoice) {
                return response()->json([
                    'message' => 'The selected invoice is invalid.',
                ], 422);
            }

            if (strtolower($invoice->status) !== 'paid') {
                return response()->json([
                    'message' => 'Credit notes can only be created for fully paid invoices.',
                ], 422);
            }
        }
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CustCreditNoteResource($model);
    }

    public function show(CustCreditNote $custCreditNote)
    {
        $this->authorize('view', $custCreditNote);

        return new CustCreditNoteResource($custCreditNote);
    }

    public function update(CustCreditNoteUpdateRequest $request, CustCreditNote $custCreditNote)
    {
        $this->authorize('update', $custCreditNote);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custCreditNote->id, $validated);
        return new CustCreditNoteResource($updated);
    }

    public function destroy(CustCreditNote $custCreditNote)
    {
        $this->authorize('delete', $custCreditNote);

        $this->service->delete($custCreditNote->id);
        return response()->noContent();
    }
}