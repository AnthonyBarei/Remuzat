<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends BaseController
{
    public function authenticated(Request $req) {
        $logged_in = Auth::check();

        if ($logged_in) {
            return $this->sendResponse(['authenticated' => true], 'Utilisateur connecté avec succès.');
        } else {
            return $this->sendError('Non authentifié.', ['error' => 'L\'utilisateur n\'est pas connecté.'], 401);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'Veuillez corriger les erreurs', 'errors' => $validator->errors()], 500);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            if ($user instanceof \App\Models\User) {
                // Check if user can access the system
                if (!$user->canAccessBookingSystem()) {
                    Auth::logout();
                    
                    if (!$user->hasVerifiedEmail()) {
                        return $this->sendError('Email non vérifié.', ['error' => 'Veuillez vérifier votre adresse email avant de vous connecter.'], 403);
                    } else {
                        return $this->sendError('Compte en attente de validation.', ['error' => 'Votre compte est en attente de validation par un administrateur.'], 403);
                    }
                }

                $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");

                $success['token'] = $user->createToken('UserLoginToken')->plainTextToken;
                $success['name'] = $name;
                $success['email'] = $user->email;
                $success['firstname'] = $user->firstname;
                $success['lastname'] = $user->lastname;
                $success['is_admin'] = $user->is_admin;
                $success['role'] = $user->role;
                $success['admin_validated'] = $user->admin_validated;

                return $this->sendResponse($success, 'Connexion réussie.');
            } else {
                return $this->sendError('Mauvaise instance d\'utilisateur.', ['error' => 'Mauvaise instance d\'utilisateur'], 500);
            }
        } else {
            return $this->sendError('Non autorisé.', ['error' => 'Non autorisé'], 401);
        }
    }

    public function logout(Request $request)
    {
        auth('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => true, 'message' => 'Déconnexion réussie']);
    }

    public function me()
    {
        return response()->json(['status' => true, 'user' => auth()->user(), 'message' => 'Profil utilisateur récupéré avec succès.']);
    }
}
