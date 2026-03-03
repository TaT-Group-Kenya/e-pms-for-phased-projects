<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\UserService;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

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
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page', 'with');

        // Optional eager loading from query string: /users?with=company,customer,groups
        $with = [];
        if ($request->filled('with')) {
            $with = array_filter(array_map('trim', explode(',', (string) $request->get('with'))));
        }

        // Always load groups and each group's roles so we can derive user roles
        $with = array_unique(array_merge($with, ['groups.roles']));

        $data = $this->service->index($filters, $perPage, $page, 0, $with);

        // Ensure relationships are loaded on the underlying collection
        $collection = $data->getCollection();
        $collection->loadMissing(['groups.roles']);

        // For each user, merge all roles from its groups and attach as a synthetic
        // "roles" relation so the resource can expose users.roles
        $collection->each(function (User $user) {
            $roles = $user->groups
                ->flatMap(function ($group) {
                    return $group->roles;
                })
                ->unique('id')
                ->values();

            $user->setRelation('roles', $roles);
        });

        return UserResource::collection($data);
    }

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();

        // Generate random password if not provided
        $rawPassword = $validated['password'] ?? Str::random(12);
        $validated['password'] = Hash::make($rawPassword);
        
        // Set email verification to current timestamp
        $validated['email_verified_at'] = now();
        
        // Generate a remember token
        $validated['remember_token'] = Str::random(100);
        
        // Set default is_active to true
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Set audit fields with authenticated user ID
        $authenticatedUser = Auth::user();
        $validated['created_by'] = $authenticatedUser->id ?? 1;
        $validated['updated_by'] = $authenticatedUser->id ?? 1;
        $validated['avatar_pic'] = "https://cdn-icons-png.freepik.com/256/12225/12225881.png";

        try {
            $model = $this->service->create($validated);

            // Send email with credentials to newly created user
            $this->sendCredentialsEmail($model, $rawPassword);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully. Credentials have been sent to their email.',
                'data' => new UserResource($model)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(User $user)
    {
        $this->authorize('view', $user);

        // Include related company, customer and groups
        $user->loadMissing(['company', 'customer', 'groups']);

        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validated();

        // Hash password if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Set audit field with authenticated user ID
        $authenticatedUser = Auth::user();
        $validated['updated_by'] = $authenticatedUser->id ?? 1;

        try {
            $updated = $this->service->update($user->id, $validated);
            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => new UserResource($updated)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        try {
            $this->service->delete($user->id, Auth::id());
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send credentials email to newly created user
     */
    private function sendCredentialsEmail(User $user, string $password): void
    {
        try {
            $mailData = [
                'user_email' => $user->email,
                'user_name' => $user->first_name . ' ' . $user->last_name,
                'password' => $password,
                'password_note' => 'Please keep this password safe. You can change it after logging in.',
            ];

            Mail::send('emails.html-user-credentials', $mailData, function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Your Account Credentials - PMS System');
            });
        } catch (\Exception $e) {
            // Log the error but don't fail the user creation
            \Log::error('Failed to send credentials email to user ' . $user->email . ': ' . $e->getMessage());
        }
    }
}