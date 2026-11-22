<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
            if ($e->getMessage() === 'Route [login] not defined.') {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
        });

        // Authorization denials: return a structured 403 that carries the
        // policy's descriptive message (which names the ROLE_* permission
        // required) plus machine-readable fields for the UI. Laravel wraps
        // AuthorizationException into AccessDeniedHttpException during
        // prepareException() before render callbacks run, so the callback
        // accepts both shapes.
        $exceptions->render(function (
            \Illuminate\Auth\Access\AuthorizationException|\Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e,
            $request
        ) {
            // 404-style denials (denyAsNotFound) keep their intended status.
            $status = $e instanceof \Illuminate\Auth\Access\AuthorizationException && $e->hasStatus()
                ? $e->status()
                : 403;
            if ($status === 404) {
                return null; // let the framework render a normal 404
            }

            if (! $request->expectsJson()) {
                return redirect()->back()->with(
                    'error',
                    'You do not have permission to perform this action.'
                );
            }

            $message = trim((string) $e->getMessage());
            if ($message === '' || $message === 'This action is unauthorized.') {
                $message = 'Access denied. You do not have permission to perform this action.';
            }

            return response()->json([
                'message' => $message,
                'error_type' => 'authorization',
            ], $status);
        });

        // Accounting period locks: 423 Locked with a structured payload so
        // the UI can explain which month is closed.
        $exceptions->render(function (\App\Exceptions\PeriodLockedException $e, $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'error' => 'PeriodLocked',
                    'period' => [
                        'date' => $e->date,
                        'id' => $e->periodId,
                        'name' => $e->periodName,
                    ],
                ], 423);
            }
        });
    })->create();
