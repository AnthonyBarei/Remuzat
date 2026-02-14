<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Vite;

class ContentSecurityPolicy
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $nonce = Vite::useCspNonce();

        $response = $next($request);

        if (method_exists($response, 'header')) {
            $response->header('Content-Security-Policy', $this->buildPolicy($nonce));
        }

        return $response;
    }

    /**
     * Build the Content Security Policy string.
     */
    protected function buildPolicy(string $nonce): string
    {
        $isDev = app()->environment('local');

        $directives = [
            "default-src"     => "'self'",
            "script-src"      => "'self' 'nonce-{$nonce}'" . ($isDev ? " http://localhost:* http://127.0.0.1:*" : ""),
            "style-src"       => "'self' 'unsafe-inline' https://fonts.googleapis.com" . ($isDev ? " http://localhost:* http://127.0.0.1:*" : ""),
            "font-src"        => "'self' https://fonts.gstatic.com",
            "img-src"         => "'self' data: blob:",
            "connect-src"     => "'self'" . ($isDev ? " ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*" : ""),
            "frame-ancestors" => "'none'",
            "base-uri"        => "'self'",
            "form-action"     => "'self'",
        ];

        return collect($directives)
            ->map(fn ($value, $key) => "{$key} {$value}")
            ->implode('; ');
    }
}
