@extends('emails.layouts.app')

@section('content')
    <h2>Votre réservation a été refusée</h2>
    
    <p>Bonjour <strong>{{ $user->firstname }} {{ $user->lastname }}</strong>,</p>
    
    <p>Nous regrettons de vous informer que votre réservation pour votre séjour à Rémuzat n'a pas pu être acceptée.</p>
    
    <div class="booking-details">
        <h3>Détails de la réservation refusée</h3>
        <p><strong>Date d'arrivée :</strong> {{ \Carbon\Carbon::parse($booking->start)->format('d/m/Y') }}</p>
        <p><strong>Date de départ :</strong> {{ \Carbon\Carbon::parse($booking->end)->format('d/m/Y') }}</p>
        <p><strong>Durée :</strong> {{ $booking->duration }} jour(s)</p>
        <p><strong>Type :</strong> {{ ucfirst($booking->type) }}</p>
        <p><strong>Statut :</strong> <span style="color: #dc3545; font-weight: bold;">✗ Refusée</span></p>
    </div>
    
    <div class="alert alert-warning">
        <strong>Que faire maintenant ?</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
            <li>Consultez d'autres dates disponibles sur notre site</li>
            <li>Contactez Odile ou Mathilde pour discuter d'alternatives</li>
            <li>Nous pouvons vous proposer d'autres périodes</li>
        </ul>
    </div>
    
    <div style="text-align: center;">
        <a href="{{ config('app.url') }}/reservation" class="btn" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0;">Faire une nouvelle réservation</a>
    </div>
    
    <p>Nous espérons pouvoir vous accueillir prochainement à Rémuzat.</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe Remuzat</strong></p>
@endsection
