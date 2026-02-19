<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return PaymentMethodResource::collection($data);
    }

    public function store(PaymentMethodStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($paymentMethod->id, $request->validated());
        return new PaymentMethodResource($updated);
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->authorize('delete', $paymentMethod);

        $this->service->delete($paymentMethod->id);
        return response()->noContent();
    }
}