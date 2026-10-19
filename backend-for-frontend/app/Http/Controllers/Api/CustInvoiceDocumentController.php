<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustInvoiceDocumentStoreRequest;
use App\Http\Requests\CustInvoiceDocumentUpdateRequest;
use App\Http\Resources\CustInvoiceDocumentResource;
use App\Models\CustInvoiceDocument;
use App\Services\CustInvoiceDocumentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustInvoiceDocumentController extends Controller
{
    protected $service;

    public function __construct(CustInvoiceDocumentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustInvoiceDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);

        return CustInvoiceDocumentResource::collection($data);
    }

    public function store(CustInvoiceDocumentStoreRequest $request)
    {
        $this->authorize('create', CustInvoiceDocument::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);

        return new CustInvoiceDocumentResource($model);
    }

    public function show(CustInvoiceDocument $custInvoiceDocument)
    {
        $this->authorize('view', $custInvoiceDocument);

        return new CustInvoiceDocumentResource($custInvoiceDocument);
    }

    public function update(CustInvoiceDocumentUpdateRequest $request, CustInvoiceDocument $custInvoiceDocument)
    {
        $this->authorize('update', $custInvoiceDocument);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custInvoiceDocument->id, $validated);

        return new CustInvoiceDocumentResource($updated);
    }

    public function destroy(CustInvoiceDocument $custInvoiceDocument)
    {
        $this->authorize('delete', $custInvoiceDocument);

        $this->service->delete($custInvoiceDocument->id);

        return response()->noContent();
    }
}
