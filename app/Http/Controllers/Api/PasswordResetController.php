<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
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
        Log::info('Forgot password request received', [
            'email' => $request->email,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            Log::info('Forgot password validation failed', [
                'errors' => $validator->errors()
            ]);
            return $this->sendError('Erreur de validation.', $validator->errors(), 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                Log::info('User not found for forgot password', [
                    'email' => $request->email
                ]);
                return $this->sendError('Aucun utilisateur trouvé avec cette adresse email.', [], 404);
            }

            Log::info('User found for password reset', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            // Send password reset email
            $token = $this->emailService->sendPasswordResetEmail($user);

            // Debug: Log the token creation
            Log::info('Password reset token created', [
                'email' => $request->email,
                'user_id' => $user->id,
                'token' => $token
            ]);

            return $this->sendResponse([], 'Un email de réinitialisation a été envoyé à votre adresse email.');
        } catch (\Exception $e) {
            Log::error('Password reset email failed: ' . $e->getMessage(), [
                'email' => $request->email,
                'exception' => $e
            ]);
            
            // Check if it's an SMTP/email configuration error
            if (str_contains($e->getMessage(), 'SSL') || str_contains($e->getMessage(), 'SMTP') || str_contains($e->getMessage(), 'mail')) {
                return $this->sendError('Erreur de configuration email. Veuillez contacter l\'administrateur.', [], 500);
            }
            
            return $this->sendError('Erreur lors de l\'envoi de l\'email de réinitialisation. Veuillez réessayer plus tard.', [], 500);
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

            // Debug: Log the token and email
            Log::info('Verifying reset token', [
                'email' => $request->email,
                'token' => $request->token,
                'user_id' => $user->id
            ]);

            // Check if the token exists in the password_resets table
            $tokenRecord = DB::table('password_resets')
                ->where('email', $request->email)
                ->first();

            Log::info('Token record found', [
                'token_record' => $tokenRecord,
                'token_expired' => $tokenRecord ? now()->diffInMinutes($tokenRecord->created_at) > 60 : null,
                'stored_token' => $tokenRecord ? $tokenRecord->token : null,
                'provided_token' => $request->token
            ]);

            if ($tokenRecord && now()->diffInMinutes($tokenRecord->created_at) <= 60) {
                // Use Laravel's Hash::check() to verify the bcrypt hashed token
                if (Hash::check($request->token, $tokenRecord->token)) {
                    return $this->sendResponse([], 'Token de réinitialisation valide.');
                }
            }
            
            return $this->sendError('Token de réinitialisation invalide ou expiré.', [], 400);
        } catch (\Exception $e) {
            Log::error('Token verification failed: ' . $e->getMessage(), [
                'email' => $request->email,
                'token' => $request->token,
                'exception' => $e
            ]);
            return $this->sendError('Erreur lors de la vérification du token.', [], 500);
        }
    }
} 