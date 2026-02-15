@extends('emails.layouts.app')

@section('content')
    <h2>Votre réservation a été approuvée !</h2>
    
    <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
    
    <p>Nous avons le plaisir de vous confirmer que votre réservation pour votre séjour à Rémuzat a été approuvée.</p>
    
    <div class="alert alert-success">
        <strong>✓ Réservation confirmée !</strong> Votre séjour est bien enregistré.
    </div>
    
    <div class="booking-details">
        <h3>Détails de votre réservation</h3>
        <p><strong>Date d'arrivée :</strong> {{ \Carbon\Carbon::parse($booking->start)->format('d/m/Y') }}</p>
        <p><strong>Date de départ :</strong> {{ \Carbon\Carbon::parse($booking->end)->format('d/m/Y') }}</p>
        <p><strong>Durée :</strong> {{ $booking->duration }} jour(s)</p>
        <p><strong>Type :</strong> {{ ucfirst($booking->type) }}</p>
        <p><strong>Statut :</strong> <span style="color: #28a745; font-weight: bold;">✓ Approuvée</span></p>
    </div>
    
    <div class="alert alert-info">
        <strong>Prochaines étapes :</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Préparez vos bagages pour votre séjour en Provence</li>
            <li>Consultez les informations pratiques sur notre site</li>
            <li>Contactez Odile ou Mathilde si vous avez des questions</li>
        </ul>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/reservation" class="btn" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0;">Voir ma réservation</a>
    </div>
    
    <p>Nous vous souhaitons un excellent séjour à Rémuzat !</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe Remuzat</strong></p>
@endsection
