@extends('emails.layouts.app')

@section('content')
    <h2>Bienvenue sur Remuzat !</h2>
    
    <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
    
    <p>Merci de vous être inscrit sur notre plateforme de réservation. Pour commencer à utiliser nos services, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
    
    <div style="text-align: center;">
        <a href="{{ $verificationUrl }}" class="btn">Confirmer mon adresse email</a>
    </div>
    
    <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
    <p style="word-break: break-all; color: #667eea;">{{ $verificationUrl }}</p>
    
    <div class="alert alert-info">
        <strong>Important :</strong> Ce lien expirera dans 60 minutes pour des raisons de sécurité.
    </div>
    
    <p>Une fois votre email confirmé, vous devrez attendre qu'un administrateur valide votre inscription pour :</p>
    <ul>
        <li>Accéder à votre espace personnel</li>
        <li>Effectuer des réservations</li>
        <li>Gérer vos séjours</li>
        <li>Recevoir des notifications importantes</li>
    </ul>
    
    <div class="alert alert-info">
        <strong>Note :</strong> Après la vérification de votre email, un administrateur sera notifié et validera votre inscription dans les plus brefs délais.
    </div>
    
    <p>Si vous n'avez pas créé de compte sur Remuzat, vous pouvez ignorer cet email.</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe Remuzat</strong></p>
@endsection 