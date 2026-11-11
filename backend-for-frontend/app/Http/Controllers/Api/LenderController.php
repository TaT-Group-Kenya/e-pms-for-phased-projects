<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LenderStoreRequest;
use App\Http\Requests\LenderUpdateRequest;
use App\Http\Resources\LenderResource;
use App\Models\Lender;
use App\Services\LenderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
 * Lenders are managed within the LOANS permission set (ROLE_VIEW_LOAN,
 * ROLE_ADD_LOAN, ROLE_EDIT_LOAN, ROLE_DELETE_LOAN) — shared with the loans
 * module, no separate lender permissions.
 */
class LenderController extends Controller
{
    protected $service;

    public function __construct(LenderService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Lender::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $search = $request->get('search');
        $filters = $request->except('per_page', 'page', 'search');
        $data = $this->service->index($filters, $perPage, $page, 0, [], $search);

        return LenderResource::collection($data);
    }

    public function store(LenderStoreRequest $request)
    {
        $this->authorize('create', Lender::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);

        return new LenderResource($model);
    }

    public function show(Lender $lender)
    {
        $this->authorize('view', Lender::class);

        return new LenderResource($lender->loadMissing('loans'));
    }

    public function update(LenderUpdateRequest $request, Lender $lender)
    {
        $this->authorize('update', Lender::class);
        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($lender->id, $validated);

        return new LenderResource($updated);
    }

    public function destroy(Lender $lender)
    {
        $this->authorize('delete', Lender::class);

        if ($lender->loans()->where('status', '!=', 'closed')->exists()) {
            return response()->json([
                'message' => 'Cannot delete: this lender is attached to loans that are not closed.',
            ], 422);
        }

        $lender->softDelete(Auth::id());

        return response()->json(['message' => 'Lender soft deleted.']);
    }
}
