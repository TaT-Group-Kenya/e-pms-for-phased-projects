<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        $this->authorize('viewAny', \App\Models\User::class);
        $users = $this->service->index([], 15);
        return view('users.index', compact('users'));
    }

    // Show form to create user
    public function create()
    {
        return view('users.create');
    }

    // Store new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'last_name' => 'required|string',
            'password' => 'required|string|min:6',
            'category' => 'required|in:internal,company,customer',
            'company_id' => 'nullable|exists:companies,id',
            'customer_id' => 'nullable|exists:customers,id',
            'avatar_pic' => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['created_by'] = 1; // example
        $validated['updated_by'] = 1;

        User::create($validated);

        return redirect('/users')->with('success', 'User created successfully');
    }

    // Show single user
    public function show($id)
    {
        $user = User::findOrFail($id);
        return view('users.show', compact('user'));
    }

    // Edit user
    public function edit($id)
    {
        $user = User::findOrFail($id);
        return view('users.edit', compact('user'));
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
            'is_active' => 'required|boolean',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $validated['updated_by'] = 1;

        $user->update($validated);

        return redirect('/users')->with('success', 'User updated successfully');
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect('/users')->with('success', 'User deleted successfully');
    }
}
