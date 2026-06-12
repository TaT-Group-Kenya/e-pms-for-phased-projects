<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;
use PDOException;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'email' => ['required','email'],
                'password' => ['required'],
                'device_name' => ['nullable','string']
            ]);

            $user = User::where('email', $data['email'])
                ->with(['company', 'customer', 'groups.roles'])
                ->first();

            if (! $user || ! Hash::check($data['password'], $user->password)) {
                return response()->json(['message' => 'Invalid credentials'], 401);
            }

            $device = $data['device_name'] ?? 'api-client';
            $token = $user->createToken($device)->plainTextToken;

            // Get user roles using direct database queries (same logic as BaseModelPolicy)
            // Step 1: Get user group IDs
            $userGroups = DB::table('user_groups')
                ->where('user_id', $user->id)
                ->where('is_deleted', false)
                ->pluck('id')
                ->toArray();
            
            // Step 2: Fetch group_roles where group_id IN list and is_deleted=false
            $groupRoles = DB::table('group_roles')
                ->whereIn('group_id', $userGroups)
                ->where('is_deleted', false)
                ->get();
            
            // Step 3: Collect role_ids and fetch role names from sys_roles
            $roleIds = $groupRoles->pluck('role_id')->toArray();
            $roles = DB::table('sys_roles')
                ->whereIn('id', $roleIds)
                ->where('is_deleted', false)
                ->get();
            
            // Attach a synthetic "roles" relation based on the user's groups
            $user->setRelation('roles', $roles);

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => new UserResource($user),
            ]);
        } catch (QueryException $e) {
            if ($this->isConnectionError($e)) {
                return response()->json(['message' => 'Database server not running'], 500);
            }
            throw $e;
        } catch (PDOException $e) {
            if ($this->isConnectionError($e)) {
                return response()->json(['message' => 'Database server not running'], 500);
            }
            throw $e;
        }
    }

    /**
     * Check if an exception is a database connection error.
     */
    private function isConnectionError(\Throwable $e): bool
    {
        // Check for PDO error code 2002 (Connection refused)
        if ($e->getCode() == 2002) {
            return true;
        }
        
        $message = $e->getMessage();
        
        // Check for common connection error indicators
        $connectionErrors = [
            'Connection refused',
            'Connection timed out',
            'SQLSTATE[HY000]',
            'Connection reset',
            'Broken pipe',
            'No route to host',
            'Network is unreachable',
        ];
        
        foreach ($connectionErrors as $error) {
            if (strpos($message, $error) !== false) {
                return true;
            }
        }
        
        return false;
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user && $request->bearerToken()) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load('groups.roles');
        return response()->json($user);
    }

    /**
     * Send a password reset link to the given user.
     */
    public function forgot(Request $request): JsonResponse
    {
        \Log::info('Password reset requested for email: ' . $request->input('email'));
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = $request->input('email');

        // only proceed if the email belongs to a registered user
        $user = User::where('email', $email)->first();
        if (! $user) {
            // return generic message to avoid user enumeration
            return response()->json(['message' => 'Reset code sent to email if it exists in our system']);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $hashed = Hash::make($code);

        $broker = config('auth.defaults.passwords');
        $table = config("auth.passwords.{$broker}.table") ?? 'password_reset_tokens';

        \Log::info("Storing password reset token for email: {$email} in table: {$table}");

        DB::table($table)->updateOrInsert([
            'email' => $email,
        ], [
            'token' => $hashed,
            'created_at' => now(),
        ]);

        try {
            $from = config('mail.from.address') ?? null;
            \Log::info("Sending password reset email to: {$email}");
            Mail::raw("Your password reset code is: {$code}", function ($message) use ($email, $from) {
                $message->to($email)->subject('Password reset code');
                if ($from) $message->from($from);
            });
        } catch (\Throwable $e) {
            // Log the error but don't reveal email sending issues to the client
            \Log::error("Failed to send password reset email to {$email}: " . $e->getMessage());
        }

        return response()->json(['message' => 'Reset code sent to email if it exists in our system']);
    }

    /**
     * Reset the user's password using the token.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        $email = $request->input('email');
        $code = $request->input('token');

        $broker = config('auth.defaults.passwords');
        $table = config("auth.passwords.{$broker}.table") ?? 'password_reset_tokens';

        $record = DB::table($table)->where('email', $email)->first();
        if (! $record) {
            return response()->json(['message' => 'Invalid or expired code'], 400);
        }

        $created = Carbon::parse($record->created_at);
        $expireMinutes = config("auth.passwords.{$broker}.expire", 60);
        if ($created->addMinutes($expireMinutes)->isPast()) {
            DB::table($table)->where('email', $email)->delete();
            return response()->json(['message' => 'Code expired'], 400);
        }

        if (! Hash::check($code, $record->token)) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            return response()->json(['message' => 'User not found'], 400);
        }

        $user->password = Hash::make($request->input('password'));
        $user->setRememberToken(Str::random(60));
        $user->save();

        event(new PasswordReset($user));

        // remove used code
        DB::table($table)->where('email', $email)->delete();

        $token = $user->createToken('api-client')->plainTextToken;

        // Get user roles using direct database queries (same logic as BaseModelPolicy)
        // Step 1: Get user group IDs
        $userGroups = DB::table('user_groups')
            ->where('user_id', $user->id)
            ->where('is_deleted', false)
            ->pluck('id')
            ->toArray();
        
        // Step 2: Fetch group_roles where group_id IN list and is_deleted=false
        $groupRoles = DB::table('group_roles')
            ->whereIn('group_id', $userGroups)
            ->where('is_deleted', false)
            ->get();
        
        // Step 3: Collect role_ids and fetch role names from sys_roles
        $roleIds = $groupRoles->pluck('role_id')->toArray();
        $roles = DB::table('sys_roles')
            ->whereIn('id', $roleIds)
            ->where('is_deleted', false)
            ->get();
        
        $user->setRelation('roles', $roles);

        return response()->json([
            'message' => 'Password has been reset',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => new UserResource($user),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
        ]);

        $user->fill($data);
        $user->save();

        // Get user roles using direct database queries (same logic as BaseModelPolicy)
        // Step 1: Get user group IDs
        $userGroups = DB::table('user_groups')
            ->where('user_id', $user->id)
            ->where('is_deleted', false)
            ->pluck('id')
            ->toArray();
        
        // Step 2: Fetch group_roles where group_id IN list and is_deleted=false
        $groupRoles = DB::table('group_roles')
            ->whereIn('group_id', $userGroups)
            ->where('is_deleted', false)
            ->get();
        
        // Step 3: Collect role_ids and fetch role names from sys_roles
        $roleIds = $groupRoles->pluck('role_id')->toArray();
        $roles = DB::table('sys_roles')
            ->whereIn('id', $roleIds)
            ->where('is_deleted', false)
            ->get();
        
        $user->setRelation('roles', $roles);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->password = Hash::make($data['new_password']);
        $user->setRememberToken(Str::random(60));
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}
