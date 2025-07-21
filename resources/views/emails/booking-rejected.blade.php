@extends('emails.layouts.app')

@section('content')
<div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f8f9fa;">
    <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4A3F35; margin: 0; font-size: 28px; font-weight: bold;">Remuzat</h1>
            <p style="color: #6D7885; margin: 10px 0 0 0; font-size: 16px;">Village de caractère en Provence</p>
        </div>

        <!-- Warning Icon -->
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background-color: #D96C57; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 40px;">⚠</span>
            </div>
        </div>

        <!-- Main Content -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4A3F35; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">
                Votre réservation a été refusée
            </h2>
            
            <p style="color: #6D7885; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                Bonjour {{ $user->firstname }} {{ $user->lastname }},
            </p>
            
            <p style="color: #6D7885; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                Nous regrettons de vous informer que votre réservation pour votre séjour à Remuzat n'a pas pu être acceptée.
            </p>
        </div>

        <!-- Booking Details -->
        <div style="background-color: #F5F0EB; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #4A3F35; margin: 0 0 20px 0; font-size: 18px; font-weight: bold; text-align: center;">
                Détails de la réservation refusée
            </h3>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6D7885; font-weight: bold;">Date d'arrivée :</span>
                <span style="color: #4A3F35;">{{ \Carbon\Carbon::parse($booking->start)->format('d/m/Y') }}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6D7885; font-weight: bold;">Date de départ :</span>
                <span style="color: #4A3F35;">{{ \Carbon\Carbon::parse($booking->end)->format('d/m/Y') }}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6D7885; font-weight: bold;">Durée :</span>
                <span style="color: #4A3F35;">{{ $booking->duration }} jour(s)</span>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span style="color: #6D7885; font-weight: bold;">Type :</span>
                <span style="color: #4A3F35;">{{ ucfirst($booking->type) }}</span>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #6D7885; font-weight: bold;">Statut :</span>
                <span style="color: #D96C57; font-weight: bold;">✗ Refusée</span>
            </div>
        </div>

        <!-- Alternative Options -->
        <div style="background-color: #F4C95D; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
            <h3 style="color: #4A3F35; margin: 0 0 15px 0; font-size: 18px; font-weight: bold; text-align: center;">
                Que faire maintenant ?
            </h3>
            
            <ul style="color: #4A3F35; margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 10px;">Consultez d'autres dates disponibles sur notre site</li>
                <li style="margin-bottom: 10px;">Contactez-nous pour discuter d'alternatives</li>
                <li style="margin-bottom: 10px;">Nous pouvons vous proposer d'autres périodes</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #6D7885; margin: 0 0 10px 0; font-size: 14px;">
                Pour discuter d'alternatives ou poser des questions :
            </p>
            <p style="color: #4A3F35; margin: 0; font-size: 14px; font-weight: bold;">
                📧 odylba@gmail.com | 📞 +33 (0)6 58 02 11 63
            </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e9ecef; padding-top: 20px;">
            <p style="color: #6D7885; margin: 0; font-size: 12px;">
                Cet email a été envoyé automatiquement. Merci de ne pas y répondre directement.
            </p>
            <p style="color: #6D7885; margin: 5px 0 0 0; font-size: 12px;">
                Refusé par : {{ $validatedBy->firstname ?? 'Administrateur' }} {{ $validatedBy->lastname ?? '' }}
            </p>
        </div>
    </div>
</div>
@endsection 