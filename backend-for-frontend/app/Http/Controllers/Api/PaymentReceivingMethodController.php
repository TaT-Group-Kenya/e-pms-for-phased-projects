<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\PaymentReceivingMethod;
use App\Services\PaymentReceivingMethodService;
use App\Http\Resources\PaymentReceivingMethodResource;
use App\Http\Requests\PaymentReceivingMethodStoreRequest;
use App\Http\Requests\PaymentReceivingMethodUpdateRequest;

class PaymentReceivingMethodController extends Controller
{
    protected $service;

    public function __construct(PaymentReceivingMethodService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', PaymentReceivingMethod::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $search = $request->get('search');
        $filters = $request->except('per_page', 'page', 'search');
        $data = $this->service->index($filters, $perPage, $page, 0, [], $search);
        return PaymentReceivingMethodResource::collection($data);
    }

    public function store(PaymentReceivingMethodStoreRequest $request)
    {
        $this->authorize('create', PaymentReceivingMethod::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new PaymentReceivingMethodResource($model);
    }

    public function show(PaymentReceivingMethod $paymentReceivingMethod)
    {
        $this->authorize('view', $paymentReceivingMethod);
        return new PaymentReceivingMethodResource($paymentReceivingMethod);
    }

    public function update(PaymentReceivingMethodUpdateRequest $request, PaymentReceivingMethod $paymentReceivingMethod)
    {
        $this->authorize('update', $paymentReceivingMethod);
        $validated = $request->validated();
        // Prevent setting inactive if attached to unpaid invoice
        if (
            isset($validated['status']) && $validated['status'] === 'inactive' &&
            $paymentReceivingMethod->custInvoices()->where('status', '!=', 'paid')->exists()
        ) {
            return response()->json([
                'message' => 'Cannot set method inactive: it is attached to a customer invoice that is not paid.'
            ], 422);
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($paymentReceivingMethod->id, $validated);
        return new PaymentReceivingMethodResource($updated);
    }

    public function destroy(PaymentReceivingMethod $paymentReceivingMethod)
    {
        $this->authorize('delete', $paymentReceivingMethod);
        // Prevent deletion if attached to unpaid invoice
        if ($paymentReceivingMethod->custInvoices()->where('status', '!=', 'paid')->exists()) {
            return response()->json([
                'message' => 'Cannot delete: method is attached to a customer invoice that is not paid.'
            ], 422);
        }
        $paymentReceivingMethod->softDelete(auth()->id());
        return response()->json(['message' => 'Payment receiving method soft deleted.']);
        // Add relationship for checking invoices
        // (This is a helper for the controller, not a real method)
        // In PaymentReceivingMethod model, add:
        // public function custInvoices() { return $this->hasMany(\App\Models\CustInvoice::class, 'payment_receiving_method_id'); }
    }

    public function restore($id)
    {
        $paymentReceivingMethod = PaymentReceivingMethod::withDeleted()->findOrFail($id);
        $this->authorize('update', $paymentReceivingMethod);
        $paymentReceivingMethod->restore();
        return new PaymentReceivingMethodResource($paymentReceivingMethod);
    }
}
