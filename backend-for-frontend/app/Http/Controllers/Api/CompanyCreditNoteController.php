<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CompanyCreditNote;
use App\Models\CompanyInvoice;
use App\Services\CompanyCreditNoteService;
use App\Services\CommonService;
use App\Http\Resources\CompanyCreditNoteResource;
use App\Http\Requests\CompanyCreditNoteStoreRequest;
use App\Http\Requests\CompanyCreditNoteUpdateRequest;

class CompanyCreditNoteController extends Controller
{
    protected $service;

    public function __construct(CompanyCreditNoteService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyCreditNote::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyCreditNoteResource::collection($data);
    }

    public function store(CompanyCreditNoteStoreRequest $request)
    {
        $validated = $request->validated();

        if (!empty($validated['invoice_id'])) {
            $invoice = CompanyInvoice::find($validated['invoice_id']);

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

        // Auto-generate a unique credit note number if not provided
        if (empty($validated['credit_note_number'] ?? null)) {
            $commonService = new CommonService();

            do {
                $number = $commonService->generateUniqueCode('CMPCN-');
            } while (CompanyCreditNote::where('credit_note_number', $number)->exists());

            $validated['credit_note_number'] = $number;
        }

        $validated['created_by'] = Auth::id();

        $model = $this->service->create($validated);
        return new CompanyCreditNoteResource($model);
    }

    public function show(CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('view', $companyCreditNote);

        return new CompanyCreditNoteResource($companyCreditNote);
    }

    public function update(CompanyCreditNoteUpdateRequest $request, CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('update', $companyCreditNote);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($companyCreditNote->id, $validated);
        return new CompanyCreditNoteResource($updated);
    }

    public function destroy(CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('delete', $companyCreditNote);

        $this->service->delete($companyCreditNote->id);
        return response()->noContent();
    }
}