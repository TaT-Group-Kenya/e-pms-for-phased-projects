<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\OrderDocument;
use App\Models\Order;
use App\Services\OrderDocumentService;
use App\Http\Resources\OrderDocumentResource;
use App\Http\Requests\OrderDocumentStoreRequest;
use App\Http\Requests\OrderDocumentUpdateRequest;

class OrderDocumentController extends Controller
{
    protected $service;

    public function __construct(OrderDocumentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\OrderDocument::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderDocumentResource::collection($data);
    }

    public function store(OrderDocumentStoreRequest $request)
    {
        $validated = $request->validated();

        if (!empty($validated['order_id'])) {
          $order = Order::findOrFail($validated['order_id']);
          if ($order->status === 'approved') {
              return response()->json([
                  'message' => 'Documents cannot be added to an approved order. Unapprove the order first.',
                  'errors'  => [
                      'order_id' => ['This order is approved and locked for changes.'],
                  ],
              ], 422);
          }
        }

        if ($request->hasFile('document_file')) {
            $file = $request->file('document_file');

            $order = isset($validated['order_id'])
                ? Order::findOrFail($validated['order_id'])
                : null;

            $originalName = $file->getClientOriginalName();
            $prefix = $order ? $order->order_number : 'order';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('order-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }

        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new OrderDocumentResource($model);
    }

    public function show(OrderDocument $orderDocument)
    {
        $this->authorize('view', $orderDocument);

        return new OrderDocumentResource($orderDocument);
    }

    public function update(OrderDocumentUpdateRequest $request, OrderDocument $orderDocument)
    {
        $this->authorize('update', $orderDocument);

        $order = $orderDocument->order ?? Order::find($orderDocument->order_id);
        if ($order && $order->status === 'approved') {
            return response()->json([
                'message' => 'Documents on an approved order cannot be edited. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $validated = $request->validated();

        if ($request->hasFile('document_file')) {
            // Remove the previous file from storage if it exists
            if ($orderDocument->document_path && Storage::disk('public')->exists($orderDocument->document_path)) {
                Storage::disk('public')->delete($orderDocument->document_path);
            }

            $file = $request->file('document_file');

            $order = $orderDocument->order ?? Order::findOrFail($orderDocument->order_id);

            $originalName = $file->getClientOriginalName();
            $prefix = $order ? $order->order_number : 'order';
            $fileName = $prefix . '-' . $originalName;

            $path = $file->storeAs('order-documents', $fileName, 'public');
            $validated['document_path'] = $path;
        }
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($orderDocument->id, $validated);
        return new OrderDocumentResource($updated);
    }

    public function destroy(OrderDocument $orderDocument)
    {
        $this->authorize('delete', $orderDocument);

        $order = $orderDocument->order ?? Order::find($orderDocument->order_id);
        if ($order && $order->status === 'approved') {
            return response()->json([
                'message' => 'Documents on an approved order cannot be deleted. Unapprove the order first.',
                'errors'  => [
                    'order_id' => ['This order is approved and locked for changes.'],
                ],
            ], 422);
        }

        $this->service->delete($orderDocument->id);
        return response()->noContent();
    }

    public function download(OrderDocument $orderDocument)
    {
        $this->authorize('view', $orderDocument);

        if (!$orderDocument->document_path) {
            return response()->json(['message' => 'Document file not found'], 404);
        }

        $disk = \Illuminate\Support\Facades\Storage::disk('public');

        if (!$disk->exists($orderDocument->document_path)) {
            return response()->json(['message' => 'Document file missing on server'], 404);
        }

        $filename = basename($orderDocument->document_path);

        return $disk->download($orderDocument->document_path, $filename);
    }
}