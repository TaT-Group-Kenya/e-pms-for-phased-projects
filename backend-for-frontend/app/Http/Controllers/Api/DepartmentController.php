<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentStoreRequest;
use App\Http\Requests\DepartmentUpdateRequest;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\DepartmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DepartmentController extends Controller
{
    protected $service;

    public function __construct(DepartmentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Department::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);

        return DepartmentResource::collection($data);
    }

    public function store(DepartmentStoreRequest $request)
    {
        $this->authorize('create', Department::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);

        return new DepartmentResource($model);
    }

    public function show(Department $department)
    {
        $this->authorize('view', $department);

        return new DepartmentResource($department);
    }

    public function update(DepartmentUpdateRequest $request, Department $department)
    {
        $this->authorize('update', $department);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($department->id, $validated);

        return new DepartmentResource($updated);
    }

    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);

        $this->service->delete($department->id);

        return response()->noContent();
    }
}
