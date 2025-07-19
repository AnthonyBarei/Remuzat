<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PasswordResetController extends BaseController
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Send password reset link.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors(), 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return $this->sendError('Aucun utilisateur trouvé avec cette adresse email.', [], 404);
            }

            // Send password reset email
            $this->emailService->sendPasswordResetEmail($user);

            return $this->sendResponse([], 'Un email de réinitialisation a été envoyé à votre adresse email.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de l\'envoi de l\'email de réinitialisation.', [], 500);
        }
    }

    /**
     * Reset password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors(), 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return $this->sendError('Aucun utilisateur trouvé avec cette adresse email.', [], 404);
            }

            // Check if the token is valid
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return $this->sendResponse([], 'Mot de passe réinitialisé avec succès.');
            } else {
                return $this->sendError('Token de réinitialisation invalide ou expiré.', [], 400);
            }
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la réinitialisation du mot de passe.', [], 500);
        }
    }

    /**
     * Verify reset token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verifyResetToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors(), 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return $this->sendError('Aucun utilisateur trouvé avec cette adresse email.', [], 404);
            }

            // Check if the token exists and is not expired
            $tokenExists = DB::table('password_resets')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->where('created_at', '>', now()->subMinutes(60))
                ->exists();

            if ($tokenExists) {
                return $this->sendResponse([], 'Token de réinitialisation valide.');
            } else {
                return $this->sendError('Token de réinitialisation invalide ou expiré.', [], 400);
            }
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la vérification du token.', [], 500);
        }
    }
} 