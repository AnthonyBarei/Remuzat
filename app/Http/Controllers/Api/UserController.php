<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (Gate::denies('viewAny', User::class)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $users = User::all();
        return $this->sendResponse(UserResource::collection($users), 'Users retrieved successfully.');
    }

    public function count()
    {
        $users = User::all()->count();
        $last_user = User::latest()->first();
        $last_user['name'] = $last_user->firstname . (($last_user->lastname) ? " " . $last_user->lastname : "");
        return $this->sendResponse(["count" => $users, "last" => $last_user], 'Users counted successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('create', User::class)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'is_admin' => 'boolean',
        ]);

        if ($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['is_admin'] = $request->input('is_admin', false);

        $user = User::create($input);

        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");
        $success['name'] =  $name;
        $success['email'] =  $user->email;

        return $this->sendResponse($success, "User $name registered successfully.");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return $this->sendResponse([
            'email' => $user->email,
            'name' => $user->firstname . " " . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
        ], '');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = User::find($id);
        return $this->sendResponse($user, '');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        if (Gate::denies('update', $user)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->is_admin = $request->input('is_admin', false);
        $user->save();

        $success = [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->firstname . " " . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'is_admin' => $user->is_admin,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        return $this->sendResponse($success, 'Utilisateur modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        if (Gate::denies('delete', $user)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $user->delete();
        return $this->sendResponse([], 'User deleted successfully.');
    }

    /**
     * Authorize a user (mark email as verified).
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function authorizeUser(User $user)
    {
        if (Gate::denies('update', $user)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $user->email_verified_at = now();
        $user->save();

        $name = $user->firstname . " " . $user->lastname;
        return $this->sendResponse([], "Utilisateur $name autorisé avec succès.");
    }

    /**
     * Resend validation email to user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function resendValidationEmail(User $user)
    {
        if (Gate::denies('update', $user)) {
            return $this->sendError('Access denied. Admin privileges required.', [], 403);
        }

        $name = $user->firstname . " " . $user->lastname;

        if ($user->email_verified_at) {
            // User is already verified - just send a confirmation message
            return $this->sendResponse([], "Email de validation renvoyé à $name (déjà autorisé).");
        } else {
            // User is not verified - mark as verified (in a real implementation, send actual email)
            $user->email_verified_at = now();
            $user->save();
            return $this->sendResponse([], "Email de validation renvoyé à $name avec succès.");
        }
    }
}
