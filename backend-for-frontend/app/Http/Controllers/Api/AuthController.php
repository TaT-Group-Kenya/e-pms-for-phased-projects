<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required','email'],
            'password' => ['required'],
            'device_name' => ['nullable','string']
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $device = $data['device_name'] ?? 'api-client';
        $token = $user->createToken($device)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
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
        return response()->json($request->user());
    }

    /**
     * Send a password reset link to the given user.
     */
    public function forgot(Request $request): JsonResponse
    {
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

        DB::table($table)->updateOrInsert([
            'email' => $email,
        ], [
            'token' => $hashed,
            'created_at' => now(),
        ]);

        try {
            $from = config('mail.from.address') ?? null;
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
        return response()->json([
            'message' => 'Password has been reset',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
}
