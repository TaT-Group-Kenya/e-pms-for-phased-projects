<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Throwable;
use PDOException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Log all exceptions to debug
        \Log::debug('Exception in render(): ' . get_class($e) . ' - Code: ' . $e->getCode() . ' - Message: ' . $e->getMessage());

        // Handle database connection errors for JSON API requests
        if ($e instanceof QueryException) {
            \Log::debug('Caught QueryException');
            if ($this->isConnectionError($e)) {
                \Log::debug('Is connection error - returning JSON');
                return response()->json(['message' => 'Database server not running'], 500);
            }
            
            // Check the previous exception (PDOException)
            $previous = $e->getPrevious();
            if ($previous instanceof PDOException && $this->isConnectionError($previous)) {
                \Log::debug('Previous exception is connection error - returning JSON');
                return response()->json(['message' => 'Database server not running'], 500);
            }
        }
        
        if ($e instanceof PDOException) {
            \Log::debug('Caught PDOException');
            if ($this->isConnectionError($e)) {
                \Log::debug('Is connection error - returning JSON');
                return response()->json(['message' => 'Database server not running'], 500);
            }
        }

        // Handle RouteNotFoundException that occurs when redirecting to non-existent login route
        if ($e instanceof RouteNotFoundException && $e->getMessage() === 'Route [login] not defined.') {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return parent::render($request, $e);
    }

    /**
     * Check if the exception is a database connection error.
     */
    private function isConnectionError(Throwable $e): bool
    {
        // Check for PDO error code 2002 (Connection refused)
        if ($e->getCode() == 2002) {
            return true;
        }
        
        $message = $e->getMessage();
        
        // Check for common connection error indicators
        $connectionErrors = [
            'Connection refused',
            'Connection timed out',
            'SQLSTATE[HY000]',
            'Connection reset',
            'Broken pipe',
            'No route to host',
            'Network is unreachable',
        ];
        
        foreach ($connectionErrors as $error) {
            if (strpos($message, $error) !== false) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Convert an authentication exception into an unauthenticated response.
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        return $request->expectsJson()
            ? response()->json(['message' => 'Unauthenticated.'], 401)
            : redirect()->guest(route('login'));
    }
}
