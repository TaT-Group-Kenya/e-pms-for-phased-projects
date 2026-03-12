<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OfficeExpenseCategory;
use App\Services\OfficeExpenseCategoryService;
use App\Http\Resources\OfficeExpenseCategoryResource;
use App\Http\Requests\OfficeExpenseCategoryStoreRequest;
use App\Http\Requests\OfficeExpenseCategoryUpdateRequest;

class OfficeExpenseCategoryController extends Controller
{
    protected $service;

    public function __construct(OfficeExpenseCategoryService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', OfficeExpenseCategory::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $query = \App\Models\OfficeExpenseCategory::query();
        if ($request->get('with_trashed')) {
            $query->withTrashed();
        }
        if ($request->get('only_trashed')) {
            $query->onlyTrashed();
        }
        foreach ($filters as $key => $value) {
            $query->where($key, $value);
        }
        $data = $query->paginate($perPage, ['*'], 'page', $page);
        return OfficeExpenseCategoryResource::collection($data);
    }

    public function store(OfficeExpenseCategoryStoreRequest $request)
    {
        $this->authorize('create', OfficeExpenseCategory::class);
        $data = $request->validated();
        $data['created_by'] = auth()->id();
        $category = $this->service->create($data);
        return new OfficeExpenseCategoryResource($category);
    }

    public function show($id)
    {
        $category = \App\Models\OfficeExpenseCategory::findOrFail($id);
        $this->authorize('view', $category);
        return new OfficeExpenseCategoryResource($category);
    }

    public function update(OfficeExpenseCategoryUpdateRequest $request, $id)
    {
        $category = \App\Models\OfficeExpenseCategory::findOrFail($id);
        $this->authorize('update', $category);
        $data = $request->validated();
        $data['updated_by'] = auth()->id();
        $category = $this->service->update($id, $data);
        return new OfficeExpenseCategoryResource($category);
    }

    public function destroy($id)
    {
        $category = \App\Models\OfficeExpenseCategory::findOrFail($id);
        $this->authorize('delete', $category);
        // Prevent deletion if category has linked expenses
        $expensesCount = $category->expenses()->count();
        if ($expensesCount > 0) {
            return response()->json(['message' => 'Cannot delete category with linked expenses.'], 400);
        }
        if (method_exists($category, 'trashed') && $category->trashed()) {
            return response()->json(['message' => 'Already deleted'], 400);
        }
        $category->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function restore($id)
    {
        $category = \App\Models\OfficeExpenseCategory::findOrFail($id);
        if (method_exists($category, 'restore')) {
            $this->authorize('update', $category);
            $category->restore();
            return new OfficeExpenseCategoryResource($category);
        }
        return response()->json(['message' => 'Restore not supported'], 400);
    }
}
