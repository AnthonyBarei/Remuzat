@extends('emails.layouts.app')

@section('content')
    <h2>Félicitations ! Votre compte a été validé</h2>
    
    <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
    
    <p>Nous avons le plaisir de vous informer que votre compte sur la plateforme Remuzat a été validé par un administrateur.</p>
    
    <div class="alert alert-success">
        <strong>🎉 Votre compte est maintenant actif !</strong>
    </div>
    
    <p>Vous pouvez dès maintenant :</p>
    <ul>
        <li>Vous connecter à votre espace personnel</li>
        <li>Effectuer des réservations pour vos séjours</li>
        <li>Gérer vos réservations existantes</li>
        <li>Recevoir des notifications importantes</li>
        <li>Accéder à toutes les fonctionnalités de la plateforme</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ config('app.url') }}/reservation" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0;">Accéder à mon espace</a>
    </div>
    
    <p>Nous vous souhaitons un excellent séjour à Remuzat !</p>
    
    <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe Remuzat</strong></p>
@endsection 