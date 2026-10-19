<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustDebitNoteItemStoreRequest;
use App\Http\Requests\CustDebitNoteItemUpdateRequest;
use App\Http\Resources\CustDebitNoteItemResource;
use App\Models\CustDebitNoteItem;
use App\Services\CustDebitNoteItemService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustDebitNoteItemController extends Controller
{
    public function __construct(private CustDebitNoteItemService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustDebitNoteItem::class);

        return CustDebitNoteItemResource::collection($this->service->index(
            $request->except('per_page', 'page'),
            max(1, (int) $request->get('per_page', 15)),
            max(1, (int) $request->get('page', 1))
        ));
    }

    public function store(CustDebitNoteItemStoreRequest $request)
    {
        $this->authorize('create', CustDebitNoteItem::class);
        $data = $request->validated();
        $data['created_by'] = Auth::id();

        return new CustDebitNoteItemResource($this->service->create($data));
    }

    public function show(CustDebitNoteItem $custDebitNoteItem)
    {
        $this->authorize('view', $custDebitNoteItem);

        return new CustDebitNoteItemResource($this->service->find($custDebitNoteItem->id));
    }

    public function update(CustDebitNoteItemUpdateRequest $request, CustDebitNoteItem $custDebitNoteItem)
    {
        $this->authorize('update', $custDebitNoteItem);
        $data = $request->validated();
        $data['updated_by'] = Auth::id();

        return new CustDebitNoteItemResource($this->service->update($custDebitNoteItem->id, $data));
    }

    public function destroy(CustDebitNoteItem $custDebitNoteItem)
    {
        $this->authorize('delete', $custDebitNoteItem);
        $this->service->delete($custDebitNoteItem->id, Auth::id());

        return response()->noContent();
    }
}
