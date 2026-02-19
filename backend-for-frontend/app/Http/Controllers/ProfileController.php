<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Company;
use App\Models\Customer;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileController extends Controller
{
    /**
     * Show the profile edit form.
     */
    public function edit()
    {
        $user = Auth::user();

        // If you want to allow selecting companies/customers in form
        $companies = Company::all();
        $customers = Customer::all();

        return view('profile.edit', compact('user', 'companies', 'customers'));
    }

    /**
     * Update the user profile.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        // Update basic user info
        $user->first_name = $validated['first_name'] ?? $user->first_name;
        $user->middle_name = $validated['middle_name'] ?? null;
        $user->last_name = $validated['last_name'] ?? $user->last_name;
        $user->email = $validated['email'] ?? $user->email;

        // Optional: update password if provided
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // Optional: profile picture upload
        if ($request->hasFile('avatar_pic')) {
            if ($user->avatar_pic) {
                Storage::delete($user->avatar_pic);
            }
            $user->avatar_pic = $request->file('avatar_pic')->store('avatars');
        }

        // Update relations
        $user->company_id = $validated['company_id'] ?? null;
        $user->customer_id = $validated['customer_id'] ?? null;

        // Update category & active status if you want to allow it
        $user->category = $validated['category'] ?? $user->category;
        $user->is_active = $validated['is_active'] ?? $user->is_active;

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return redirect()->route('profile.edit')->with('status', 'Profile updated successfully!');
    }

    /**
     * Optionally: Delete user account
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        return redirect('/')->with('status', 'Your account has been deleted.');
    }
}
