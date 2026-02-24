<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        try {
            $this->authorize('viewAny', \App\Models\User::class);
            $users = User::all();
            
            return response()->json([
                'success' => true,
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage()
            ], 500);
        }
    }

    // Store new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'password' => 'nullable|string|min:6',
            'category' => 'required|in:internal,company,customer',
            'company_id' => 'nullable|exists:companies,id',
            'customer_id' => 'nullable|exists:customers,id',
            'avatar_pic' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

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

        try {
            $user = User::create($validated);

            // Send email with credentials to newly created user
            $this->sendCredentialsEmail($user, $rawPassword);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully. Credentials have been sent to their email.',
                'data' => $user
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    // Show single user
    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or error fetching user: ' . $e->getMessage()
            ], 404);
        }
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'email' => 'required|email|unique:users,email,' . $id,
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'password' => 'nullable|string|min:6',
            'category' => 'required|in:internal,company,customer',
            'company_id' => 'nullable|exists:companies,id',
            'customer_id' => 'nullable|exists:customers,id',
            'avatar_pic' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Set audit field with authenticated user ID
        $authenticatedUser = Auth::user();
        $validated['updated_by'] = $authenticatedUser->id ?? 1;

        try {
            $user->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete user
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

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

            Mail::send('emails.user-credentials', $mailData, function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Your Account Credentials - PMS System');
            });
        } catch (\Exception $e) {
            // Log the error but don't fail the user creation
            \Log::error('Failed to send credentials email to user ' . $user->email . ': ' . $e->getMessage());
        }
    }
}

