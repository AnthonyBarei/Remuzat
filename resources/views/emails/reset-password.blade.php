@extends('emails.layouts.app')

@section('content')
    <h2>Réinitialisation de votre mot de passe</h2>
    
    <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
    
    <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Remuzat. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
    
    <div style="text-align: center;">
        <a href="{{ $resetUrl }}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0;">Réinitialiser mon mot de passe</a>
    </div>
    
    <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
    <p style="word-break: break-all; color: #667eea;">{{ $resetUrl }}</p>
    
    <div class="alert alert-warning">
        <strong>Sécurité :</strong> Ce lien expirera dans 60 minutes. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
    </div>
    
    <p>Pour des raisons de sécurité, nous vous recommandons de :</p>
    <ul>
        <li>Choisir un mot de passe fort et unique</li>
        <li>Ne pas partager votre mot de passe</li>
        <li>Utiliser des caractères spéciaux, des chiffres et des lettres</li>
    </ul>
    
    <p>Si vous n'avez pas demandé cette réinitialisation, votre compte est en sécurité et aucune action n'est requise de votre part.</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe Remuzat</strong></p>
@endsection 