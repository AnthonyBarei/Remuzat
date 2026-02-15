<?php

namespace App\Providers;

use App\Mail\Transport\BrevoApiTransport;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Schema::defaultStringLength(191);

        Mail::extend('brevo', function (array $config) {
            return new BrevoApiTransport($config['key']);
        });

        // Disable Brevo tracking pixel on SMTP transport (image without alt attribute)
        Event::listen(MessageSending::class, function (MessageSending $event) {
            $event->message->getHeaders()->addTextHeader('X-Mailin-Track', '0');
        });
    }
}
