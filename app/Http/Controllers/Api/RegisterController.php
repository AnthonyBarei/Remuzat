<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class RegisterController extends BaseController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()){
            return $this->sendError('Erreur de validation.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input['admin_validated'] = false; // New users need admin validation

        $user = User::create($input);

        // Send verification email
        try {
            $emailService = new EmailService();
            $emailService->sendVerificationEmail($user);
        } catch (\Exception $e) {
            // Log the error but don't fail the registration
            Log::error('Failed to send verification email: ' . $e->getMessage());
        }

        // Send admin notification for new user registration
        try {
            $emailService->sendAdminNewUserNotification($user);
        } catch (\Exception $e) {
            // Log the error but don't fail the registration
            Log::error('Failed to send admin notification for new user: ' . $e->getMessage());
        }

        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");

        // $success['token'] = $user->createToken('UserLoginToken')->plainTextToken;
        $success['name'] = $name;
        $success['email'] = $user->email;
        $success['is_admin'] = $user->is_admin;

        return $this->sendResponse($success, 'Utilisateur enregistré avec succès. Un email de vérification a été envoyé à votre adresse email. Veuillez attendre qu\'un administrateur valide votre inscription.');
    }
}
