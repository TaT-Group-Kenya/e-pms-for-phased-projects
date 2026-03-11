<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OfficeExpensePayment;
use App\Services\OfficeExpensePaymentService;
use App\Http\Resources\OfficeExpensePaymentResource;
use App\Http\Requests\OfficeExpensePaymentStoreRequest;
use App\Http\Requests\OfficeExpensePaymentUpdateRequest;

class OfficeExpensePaymentController extends Controller
{
    protected $service;

    public function __construct(OfficeExpensePaymentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', OfficeExpensePayment::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OfficeExpensePaymentResource::collection($data);
    }

    public function store(OfficeExpensePaymentStoreRequest $request)
    {
        $this->authorize('create', OfficeExpensePayment::class);
        $data = $request->validated();
        $data['created_by'] = auth()->id();
        $payment = $this->service->create($data);
        return new OfficeExpensePaymentResource($payment);
    }

    public function show($id)
    {
        $payment = $this->service->find($id);
        $this->authorize('view', $payment);
        return new OfficeExpensePaymentResource($payment);
    }

    public function update(OfficeExpensePaymentUpdateRequest $request, $id)
    {
        $payment = $this->service->find($id);
        $this->authorize('update', $payment);
        $data = $request->validated();
        $data['updated_by'] = auth()->id();
        $payment = $this->service->update($id, $data);
        return new OfficeExpensePaymentResource($payment);
    }

    public function destroy($id)
    {
        $payment = $this->service->find($id);
        $this->authorize('delete', $payment);
        $this->service->delete($id);
        return response()->json(['message' => 'Deleted successfully']);
    }
}
