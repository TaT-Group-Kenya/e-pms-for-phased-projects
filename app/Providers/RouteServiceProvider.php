<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as BaseServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends BaseServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        $this->routes(function () {
            // Load API routes under the exact prefix required by the project
            Route::prefix('e-pms/api/v1')
                ->middleware('api')
                ->group(base_path('routes/api.php'));

            // Keep web routes as-is
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}
