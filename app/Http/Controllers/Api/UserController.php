<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        $users = User::all();
        return $this->sendResponse(UserResource::collection($users), 'Utilisateurs récupérés avec succès.');
    }

    public function count()
    {
        $users = User::all()->count();
        $last_user = User::latest()->first();
        $last_user['name'] = $last_user->firstname . (($last_user->lastname) ? " " . $last_user->lastname : "");
        return $this->sendResponse(["count" => $users, "last" => $last_user], 'Utilisateurs comptés avec succès.');
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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'is_admin' => 'boolean',
            'role' => 'sometimes|in:user,admin,super_admin',
        ]);

        if ($validator->fails()){
            return $this->sendError('Erreur de validation.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['is_admin'] = $request->input('is_admin', false);
        
        // Set role based on is_admin or provided role
        if ($request->has('role')) {
            $input['role'] = $request->input('role');
            $input['is_admin'] = in_array($input['role'], ['admin', 'super_admin']);
        } else {
            $input['role'] = $input['is_admin'] ? 'admin' : 'user';
        }

        // Only super admins can create super admins
        if ($input['role'] === 'super_admin' && !auth()->user()->isSuperAdmin()) {
            return $this->sendError('Accès refusé. Seuls les super administrateurs peuvent créer des utilisateurs super administrateur.', [], 403);
        }

        $user = User::create($input);

        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");
        $success['name'] =  $name;
        $success['email'] =  $user->email;
        $success['role'] =  $user->role_display_name;

        return $this->sendResponse($success, "Utilisateur $name enregistré avec succès.");
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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'is_admin' => 'boolean',
            'role' => 'sometimes|in:user,admin,super_admin',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors());
        }

        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->is_admin = $request->input('is_admin', false);
        
        // Handle role update
        if ($request->has('role')) {
            $newRole = $request->input('role');
            
            // Only super admins can assign super admin role
            if ($newRole === 'super_admin' && !auth()->user()->isSuperAdmin()) {
                return $this->sendError('Accès refusé. Seuls les super administrateurs peuvent attribuer le rôle super administrateur.', [], 403);
            }
            
            $user->role = $newRole;
            $user->is_admin = in_array($newRole, ['admin', 'super_admin']);
        }
        
        $user->save();

        $success = [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->firstname . " " . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'is_admin' => $user->is_admin,
            'role' => $user->role,
            'role_display_name' => $user->role_display_name,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        return $this->sendResponse($success, 'Utilisateur modifié avec succès.');
    }

    /**
     * Update the authenticated user's profile (password change).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors());
        }

        // Check if current password is correct
        if (!Hash::check($request->current_password, $user->password)) {
            return $this->sendError('Le mot de passe actuel est incorrect.', [], 400);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return $this->sendResponse([], 'Mot de passe mis à jour avec succès.');
    }

    /**
     * Get the authenticated user's profile information.
     *
     * @return \Illuminate\Http\Response
     */
    public function profile()
    {
        $user = auth()->user();
        
        $profile = [
            'id' => $user->id,
            'name' => $user->firstname . ' ' . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'is_admin' => $user->is_admin,
            'role' => $user->role,
            'role_display_name' => $user->role_display_name,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        return $this->sendResponse($profile, 'Profil récupéré avec succès.');
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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        $user->delete();
        return $this->sendResponse([], 'Utilisateur supprimé avec succès.');
    }

    /**
     * Delete the authenticated user's account.
     *
     * @return \Illuminate\Http\Response
     */
    public function deleteProfile()
    {
        $user = auth()->user();
        
        // Delete user's bookings first
        $user->bookings()->delete();
        
        // Delete the user
        $user->delete();

        return $this->sendResponse([], 'Compte supprimé avec succès.');
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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
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
            return $this->sendError('Accès refusé. Privilèges administrateur requis.', [], 403);
        }

        $name = $user->firstname . " " . $user->lastname;

        try {
            $emailService = new EmailService();
            
            if ($user->email_verified_at) {
                // User is already verified - just send a confirmation message
                return $this->sendResponse([], "Email de validation renvoyé à $name (déjà autorisé).");
            } else {
                // Send actual verification email
                $emailService->resendVerificationEmail($user);
                return $this->sendResponse([], "Email de validation renvoyé à $name avec succès.");
            }
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de l\'envoi de l\'email de validation.', [], 500);
        }
    }
}
