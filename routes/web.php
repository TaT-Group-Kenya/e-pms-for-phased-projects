<?php

use Illuminate\Support\Facades\Route;

// Web routes disabled — serving API docs (Swagger UI) at root instead.
Route::get('/', function () {
    return response()->file(public_path('swagger-ui/index.html'));
});

// Keep this file intentionally minimal: the application uses `routes/api.php` for the API.
