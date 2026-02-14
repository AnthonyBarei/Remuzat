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
        Schema::table('bookings', function (Blueprint $table) {
            if (!Schema::hasColumn('bookings', 'status')) {
                $table->enum('status', ['pending', 'approved', 'cancelled'])->default('pending')->after('type');
            }
            if (!Schema::hasColumn('bookings', 'end_day')) {
                $table->integer('end_day')->after('start_day');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            if (Schema::hasColumn('bookings', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('bookings', 'end_day')) {
                $table->dropColumn('end_day');
            }
        });
    }
};
