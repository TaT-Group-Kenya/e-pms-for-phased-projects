<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Http\Resources\DepartmentResource;
use App\Http\Requests\DepartmentStoreRequest;
use App\Http\Requests\DepartmentUpdateRequest;

class DepartmentController extends Controller
{
    protected $service;

    public function __construct(DepartmentService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Department::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return DepartmentResource::collection($data);
    }

    public function store(DepartmentStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($department->id, $request->validated());
        return new DepartmentResource($updated);
    }

    public function destroy(Department $department)
    {
        $this->authorize('delete', $department);

        $this->service->delete($department->id);
        return response()->noContent();
    }
}