<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyCreditNote;
use App\Services\CompanyCreditNoteService;
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
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($companyCreditNote->id, $request->validated());
        return new CompanyCreditNoteResource($updated);
    }

    public function destroy(CompanyCreditNote $companyCreditNote)
    {
        $this->authorize('delete', $companyCreditNote);

        $this->service->delete($companyCreditNote->id);
        return response()->noContent();
    }
}