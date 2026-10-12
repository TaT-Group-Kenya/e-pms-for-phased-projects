<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Daily 07:00: notify ops about transit containers/units that hit the configured
// notification day (default day 25 of 30) but have not exited the country yet.
Schedule::command('ship-containers:notify-transit-exits')->dailyAt('07:00');
