<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return CustomerResource::collection($data);
    }

    public function store(CustomerStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new CustomerResource($model);
    }

    public function show(Customer $customer)
    {
        $this->authorize('view', $customer);

        return new CustomerResource($customer);
    }

    public function update(CustomerUpdateRequest $request, Customer $customer)
    {
        $this->authorize('update', $customer);

        $updated = $this->service->update($customer->id, $request->validated());
        return new CustomerResource($updated);
    }

    public function destroy(Customer $customer)
    {
        $this->authorize('delete', $customer);

        $this->service->delete($customer->id);
        return response()->noContent();
    }
}