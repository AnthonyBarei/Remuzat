<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start');
            $table->dateTime('end');
            $table->integer('start_day');
            $table->integer('end_day');
            $table->integer('gap');
            $table->integer('duration');
            $table->string('type');
            $table->enum('status', ['pending', 'approved', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('added_by');
            $table->unsignedBigInteger('validated_by')->nullable();
            $table->timestamps();

            $table->foreign('added_by')->references('id')->on('users');
            $table->foreign('validated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
