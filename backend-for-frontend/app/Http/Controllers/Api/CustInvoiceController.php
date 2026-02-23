<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\CustInvoice;
use App\Services\CustInvoiceService;
use App\Http\Resources\CustInvoiceResource;
use App\Http\Requests\CustInvoiceStoreRequest;
use App\Http\Requests\CustInvoiceUpdateRequest;

class CustInvoiceController extends Controller
{
    protected $service;

    public function __construct(CustInvoiceService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoice::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustInvoiceResource::collection($data);
    }

    public function store(CustInvoiceStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new CustInvoiceResource($model);
    }

    public function show(CustInvoice $custInvoice)
    {
        $this->authorize('view', $custInvoice);

        return new CustInvoiceResource($custInvoice);
    }

    public function update(CustInvoiceUpdateRequest $request, CustInvoice $custInvoice)
    {
        $this->authorize('update', $custInvoice);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($custInvoice->id, $validated);
        return new CustInvoiceResource($updated);
    }

    public function destroy(CustInvoice $custInvoice)
    {
        $this->authorize('delete', $custInvoice);

        $this->service->delete($custInvoice->id);
        return response()->noContent();
    }
}