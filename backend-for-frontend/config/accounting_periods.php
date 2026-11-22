<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trial balance snapshot forex rate fallback
    |--------------------------------------------------------------------------
    |
    | Used when a period is closed without an explicit rate. Production flows
    | always pass the rate from the close dialog, so this is only a safety
    | net (1 = no translation).
    |
    */

    'snapshot_forex_rate_fallback' => env('PERIOD_SNAPSHOT_FOREX_FALLBACK', 1),
];
