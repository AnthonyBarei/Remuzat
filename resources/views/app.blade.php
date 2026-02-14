<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Remuzat - Système de Réservation</title>
        
        <!-- Favicon -->
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="theme-color" content="#1976d2">
        
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

        <!-- Fonts -->
        {{-- <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"> --}}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>

        <style nonce="{{ Vite::cspNonce() }}">
            body {
                font-family: 'Nunito', sans-serif;
            }
        </style>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.ts'])
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>
