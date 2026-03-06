<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PaymentMethod;
use App\Services\PaymentMethodService;
use App\Http\Resources\PaymentMethodResource;
use App\Http\Requests\PaymentMethodStoreRequest;
use App\Http\Requests\PaymentMethodUpdateRequest;

class PaymentMethodController extends Controller
{
    protected $service;

    public function __construct(PaymentMethodService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\PaymentMethod::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return PaymentMethodResource::collection($data);
    }

    public function store(PaymentMethodStoreRequest $request)
    {
        $this->authorize('create', \App\Models\PaymentMethod::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new PaymentMethodResource($model);
    }

    public function show(PaymentMethod $paymentMethod)
    {
        $this->authorize('view', $paymentMethod);

        return new PaymentMethodResource($paymentMethod);
    }

    public function update(PaymentMethodUpdateRequest $request, PaymentMethod $paymentMethod)
    {
        $this->authorize('update', $paymentMethod);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($paymentMethod->id, $validated);
        return new PaymentMethodResource($updated);
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->authorize('delete', $paymentMethod);

        $this->service->delete($paymentMethod->id);
        return response()->noContent();
    }
}