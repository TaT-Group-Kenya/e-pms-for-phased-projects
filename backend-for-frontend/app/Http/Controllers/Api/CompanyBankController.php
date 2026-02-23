<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyBank;
use App\Services\CompanyBankService;
use App\Http\Resources\CompanyBankResource;
use App\Http\Requests\CompanyBankStoreRequest;
use App\Http\Requests\CompanyBankUpdateRequest;

class CompanyBankController extends Controller
{
    protected $service;

    public function __construct(CompanyBankService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyBank::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyBankResource::collection($data);
    }

    public function store(CompanyBankStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CompanyBankResource($model);
    }

    public function show(CompanyBank $companyBank)
    {
        $this->authorize('view', $companyBank);

        return new CompanyBankResource($companyBank);
    }

    public function update(CompanyBankUpdateRequest $request, CompanyBank $companyBank)
    {
        $this->authorize('update', $companyBank);

        $updated = $this->service->update($companyBank->id, $request->validated());
        return new CompanyBankResource($updated);
    }

    public function destroy(CompanyBank $companyBank)
    {
        $this->authorize('delete', $companyBank);

        $this->service->delete($companyBank->id);
        return response()->noContent();
    }
}