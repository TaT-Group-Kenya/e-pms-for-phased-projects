<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartOfAccountStoreRequest;
use App\Http\Requests\ChartOfAccountUpdateRequest;
use App\Http\Resources\ChartOfAccountResource;
use App\Models\Account;
use App\Models\ChartOfAccount;
use App\Services\ChartOfAccountService;
use Illuminate\Http\Request;

class ChartOfAccountController extends Controller
{
    protected $service;

    public function __construct(ChartOfAccountService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        // Chart of accounts are managed under the Account permission set
        // (ROLE_VIEW_ACCOUNT etc.), no dedicated roles exist for them.
        $this->authorize('viewAny', Account::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);

        return ChartOfAccountResource::collection($data);
    }

    public function store(ChartOfAccountStoreRequest $request)
    {
        $this->authorize('create', Account::class);
        $validated = $request->validated();
        $validated['created_by'] = auth()->id();
        $validated['created_at'] = now();
        $model = $this->service->create($validated);

        return new ChartOfAccountResource($model);
    }

    public function show(ChartOfAccount $chartOfAccount)
    {
        $this->authorize('view', Account::class);

        return new ChartOfAccountResource($chartOfAccount);
    }

    public function update(ChartOfAccountUpdateRequest $request, ChartOfAccount $chartOfAccount)
    {
        $this->authorize('update', Account::class);

        $validated = $request->validated();
        $validated['updated_by'] = auth()->id();
        $validated['updated_at'] = now();
        $updated = $this->service->update($chartOfAccount->id, $validated);

        return new ChartOfAccountResource($updated);
    }

    public function destroy(ChartOfAccount $chartOfAccount)
    {
        $this->authorize('delete', Account::class);

        $this->service->delete($chartOfAccount->id);

        return response()->noContent();
    }
}