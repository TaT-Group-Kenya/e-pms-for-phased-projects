<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Customer;
use App\Services\CustomerService;
use App\Http\Resources\CustomerResource;
use App\Http\Requests\CustomerStoreRequest;
use App\Http\Requests\CustomerUpdateRequest;

class CustomerController extends Controller
{
    protected $service;

    public function __construct(CustomerService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Customer::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return CustomerResource::collection($data);
    }

    public function store(CustomerStoreRequest $request)
    {
        $this->authorize('create', \App\Models\Customer::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }
        
        $model = $this->service->create($validated);
        return new CustomerResource($model);
    }

    public function show(Customer $customer)
    {
        $this->authorize('view', $customer);

        // Eager load all relationships
        $customer->load([
            'users',
            'projects',
            'quotations',
            'orders',
            'invoices',
            'projectOwners'
        ]);

        return new CustomerResource($customer);
    }

    public function update(CustomerUpdateRequest $request, Customer $customer)
    {
        $this->authorize('update', $customer);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '.' . strtolower($file->getClientOriginalExtension());
            $file->storeAs('logos', $filename, 'public');
            $validated['logo'] = $filename;
        }
        
        $updated = $this->service->update($customer->id, $validated);
        return new CustomerResource($updated);
    }

    public function destroy(Customer $customer)
    {
        $this->authorize('delete', $customer);

        $this->service->delete($customer->id, Auth::id());
        return response()->noContent();
    }
}