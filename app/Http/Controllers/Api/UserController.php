<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\UserService;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;

class UserController extends Controller
{
    protected $service;

    public function __construct(UserService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\User::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return UserResource::collection($data);
    }

    public function store(UserStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new UserResource($model);
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $updated = $this->service->update($user->id, $request->validated());
        return new UserResource($updated);
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $this->service->delete($user->id);
        return response()->noContent();
    }
}