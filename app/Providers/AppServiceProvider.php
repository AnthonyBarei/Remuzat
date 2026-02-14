<?php

namespace App\Providers;

use App\Mail\Transport\BrevoApiTransport;
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
    }
}
