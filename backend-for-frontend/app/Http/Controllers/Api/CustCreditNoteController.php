<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustCreditNote;
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
        $data = $this->service->index($request->all(), $perPage);
        return CustCreditNoteResource::collection($data);
    }

    public function store(CustCreditNoteStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($custCreditNote->id, $request->validated());
        return new CustCreditNoteResource($updated);
    }

    public function destroy(CustCreditNote $custCreditNote)
    {
        $this->authorize('delete', $custCreditNote);

        $this->service->delete($custCreditNote->id);
        return response()->noContent();
    }
}