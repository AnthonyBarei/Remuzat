@extends('emails.layouts.app')

@section('content')
    <h2>Nouvelle réservation - Action requise</h2>
    
    <p>Bonjour,</p>
    
    <p>Une nouvelle réservation a été créée sur la plateforme Remuzat et nécessite votre attention.</p>
    
    <div class="booking-details">
        <h3>Détails de la réservation</h3>
        <p><strong>Client :</strong> {{ $booking->user->firstname }} {{ $booking->user->lastname }}</p>
        <p><strong>Email :</strong> {{ $booking->user->email }}</p>
        <p><strong>Date de début :</strong> {{ $booking->start->format('d/m/Y H:i') }}</p>
        <p><strong>Date de fin :</strong> {{ $booking->end->format('d/m/Y H:i') }}</p>
        <p><strong>Durée :</strong> {{ $booking->duration }} jour(s)</p>
        <p><strong>Type :</strong> {{ ucfirst($booking->type) }}</p>
        <p><strong>Statut :</strong> 
            <span style="color: {{ $booking->status === 'pending' ? '#ffc107' : ($booking->status === 'approved' ? '#28a745' : '#dc3545') }};">
                {{ ucfirst($booking->status) }}
            </span>
        </p>
        <p><strong>Date de création :</strong> {{ $booking->created_at->format('d/m/Y H:i') }}</p>
    </div>

    @if($overlappingBookings->count() > 0)
        <div class="alert alert-warning">
            <h4>⚠️ Réservations en conflit détectées</h4>
            <p>Cette réservation chevauche les réservations suivantes :</p>
            <ul>
                @foreach($overlappingBookings as $overlap)
                    <li>
                        <strong>{{ $overlap->user->firstname }} {{ $overlap->user->lastname }}</strong> 
                        ({{ $overlap->start->format('d/m/Y') }} - {{ $overlap->end->format('d/m/Y') }})
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    <div style="text-align: center; margin: 30px 0;">
        <a href="{{ config('app.url') }}/admin" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: 500; margin: 20px 0;">Accéder au panneau d'administration</a>
    </div>
    
    <p>Actions recommandées :</p>
    <ul>
        <li>Vérifier les détails de la réservation</li>
        <li>Approuver ou rejeter la demande</li>
        <li>Contacter le client si nécessaire</li>
        <li>Gérer les conflits de réservation</li>
    </ul>
    
    <p>Cordialement,<br>
    <strong>Système de notification Remuzat</strong></p>
@endsection 