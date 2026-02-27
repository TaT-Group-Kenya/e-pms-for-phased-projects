<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Services\CompanyService;
use App\Http\Resources\CompanyResource;
use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    protected $service;

    public function __construct(CompanyService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Company::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CompanyResource::collection($data);
    }

    public function store(CompanyStoreRequest $request)
    {
        $this->authorize('create', Company::class);

        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }
        
        $model = $this->service->create($validated);
        return new CompanyResource($model);
    }

    public function show(Company $company)
    {
        $this->authorize('view', $company);

        // Eager load all relationships
        $company->load([
            'users',
            'assignments.project',
            'bankAccounts',
            'invoices'
        ]);

        return new CompanyResource($company);
    }

    public function update(CompanyUpdateRequest $request, Company $company)
    {
        $this->authorize('update', $company);

        $validated = $request->validated();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }

        $updated = $this->service->update($company->id, $validated);
        return new CompanyResource($updated);
    }

    public function destroy(Company $company)
    {
        $this->authorize('delete', $company);

        $this->service->delete($company->id);
        return response()->noContent();
    }
}