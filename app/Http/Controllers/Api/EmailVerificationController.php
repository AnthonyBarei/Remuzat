<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmailVerificationController extends BaseController
{
    protected $emailService;

    public function __construct(EmailService $emailService)
    {
        $this->emailService = $emailService;
    }

    /**
     * Verify email address.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'hash' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Erreur de validation.', $validator->errors(), 422);
        }

        try {
            $user = User::findOrFail($request->id);

            if (!$user) {
                return $this->sendError('Utilisateur non trouvé.', [], 404);
            }

            if ($user->hasVerifiedEmail()) {
                return $this->sendResponse([], 'Email déjà vérifié.');
            }

            // Verify the hash
            if (!hash_equals(sha1($user->getEmailForVerification()), $request->hash)) {
                return $this->sendError('Lien de vérification invalide.', [], 400);
            }

            // Mark email as verified
            $user->markEmailAsVerified();

            return $this->sendResponse([], 'Email vérifié avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la vérification de l\'email.', [], 500);
        }
    }

    /**
     * Resend verification email.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function resend(Request $request)
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

            if ($user->hasVerifiedEmail()) {
                return $this->sendResponse([], 'Email déjà vérifié.');
            }

            // Resend verification email
            $this->emailService->resendVerificationEmail($user);

            return $this->sendResponse([], 'Email de vérification renvoyé avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de l\'envoi de l\'email de vérification.', [], 500);
        }
    }

    /**
     * Check if email is verified.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function check(Request $request)
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return $this->sendError('Utilisateur non authentifié.', [], 401);
            }

            return $this->sendResponse([
                'verified' => $user->hasVerifiedEmail(),
                'email' => $user->email,
            ], 'Statut de vérification récupéré avec succès.');
        } catch (\Exception $e) {
            return $this->sendError('Erreur lors de la vérification du statut.', [], 500);
        }
    }
} 