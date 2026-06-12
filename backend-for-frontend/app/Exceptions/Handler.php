<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Throwable;
use PDOException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

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
        
        // Register a custom renderable callback for AuthorizationException
        $this->renderable(function (AuthorizationException $e, $request) {
            return $this->handleAuthorizationException($request, $e);
        });
        
        // Also handle AccessDeniedHttpException which is what Laravel actually throws for policies
        $this->renderable(function (AccessDeniedHttpException $e, $request) {
            return $this->handleAuthorizationException($request, $e);
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $e)
    {
        // Log all exceptions to debug
        \Log::debug('Exception in render(): ' . get_class($e) . ' - Code: ' . $e->getCode() . ' - Message: ' . $e->getMessage());

        // Handle ALL database-related errors for JSON API requests
        if ($e instanceof QueryException || $e instanceof PDOException) {
            \Log::debug('Caught database exception');
            
            // Return a generic database error message for any database-related issue
            return response()->json([
                'message' => 'Database server is down or database error occurred',
                'error' => 'Database Unavailable'
            ], 500);
        }

        // Or more specifically, check for SQLSTATE errors including table not found
        if ($e instanceof QueryException) {
            \Log::debug('Caught QueryException');
            
            // Get SQLSTATE code
            $sqlState = $e->errorInfo[0] ?? null;
            $errorCode = $e->errorInfo[1] ?? null;
            
            // SQLSTATE codes for various database errors:
            // 42S02 - Base table not found
            // 42S22 - Column not found
            // 42000 - Syntax error or access violation
            // HY000 - General error
            // 2002 - Connection refused
            // 1045 - Access denied
            // 1049 - Unknown database
            $databaseErrors = ['42S02', '42S22', '42000', 'HY000', '2002', '1045', '1049'];
            
            if (in_array($sqlState, $databaseErrors) || in_array($errorCode, [2002, 1045, 1049, 1146])) {
                \Log::debug('Database error detected - SQLSTATE: ' . $sqlState . ', Error Code: ' . $errorCode);
                return response()->json([
                    'message' => 'Database server is down or database error occurred'
                ], 500);
            }
            
            // Check the previous exception (PDOException)
            $previous = $e->getPrevious();
            if ($previous instanceof PDOException) {
                $previousCode = $previous->getCode();
                $previousMessage = $previous->getMessage();
                
                if ($this->isDatabaseError($previous) || $previousCode == 2002 || strpos($previousMessage, 'SQLSTATE') !== false) {
                    \Log::debug('Previous exception is database error');
                    return response()->json([
                        'message' => 'Database server is down'
                    ], 500);
                }
            }
        }
        
        if ($e instanceof PDOException) {
            \Log::debug('Caught PDOException');
            if ($this->isDatabaseError($e)) {
                \Log::debug('Is database error - returning JSON');
                return response()->json([
                    'message' => 'Database server is down'
                ], 500);
            }
        }

        // Handle RouteNotFoundException that occurs when redirecting to non-existent login route
        if ($e instanceof RouteNotFoundException && $e->getMessage() === 'Route [login] not defined.') {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Let parent handle all other exceptions (including AuthorizationException)
        // The renderable callbacks will intercept AuthorizationException before parent handles it
        return parent::render($request, $e);
    }

    /**
     * Handle 403 AuthorizationException from policy violations.
     * Extracts the model and builds a descriptive error message.
     */
    private function handleAuthorizationException($request, Throwable $e)
    {
        // Only return JSON for API requests
        if (!$request->expectsJson()) {
            // For web requests, redirect back with error message
            return redirect()->back()->with('error', 'You do not have permission to perform this action.');
        }
        
        $message = $e->getMessage();
        \Log::info('Handling AuthorizationException: ' . $message);
        
        // Try to extract model and action from the exception
        $model = null;
        $action = null;
        
        // Check if this is from a policy - look for specific patterns
        if (strpos($message, 'This action is unauthorized') !== false) {
            // Try to get more context from the request
            $route = $request->route();
            if ($route) {
                $controllerAction = $route->getActionName();
                $routeName = $route->getName();
                
                // Try to extract model from route parameters
                $routeParameters = $route->parameters();
                foreach ($routeParameters as $key => $value) {
                    if (is_object($value)) {
                        $modelClass = class_basename($value);
                        $model = $modelClass;
                        break;
                    }
                }
                
                // Try to extract action from route name or controller
                if ($routeName) {
                    $action = Str::afterLast($routeName, '.');
                } elseif ($controllerAction) {
                    $action = Str::afterLast($controllerAction, '@');
                }
            }
        }
        
        // Build a user-friendly message
        if ($model && $action) {
            $modelName = Str::title(str_replace(['_', '-'], ' ', $model));
            $actionName = $this->getActionName($action);
            
            return response()->json([
                'message' => "Access denied. You are not authorized to {$actionName} {$modelName}.",
                'error_type' => 'authorization'
            ], 403);
        } elseif ($model) {
            $modelName = Str::title(str_replace(['_', '-'], ' ', $model));
            return response()->json([
                'message' => "Access denied. You cannot perform this action on {$modelName}.",
                'error_type' => 'authorization'
            ], 403);
        }
        
        // Fallback to generic message
        return response()->json([
            'message' => 'Access denied. You do not have permission to perform this action.',
            'error_type' => 'authorization'
        ], 403);
    }
    
    /**
     * Convert action method name to readable text
     */
    private function getActionName($action)
    {
        $actions = [
            'view' => 'view',
            'edit' => 'edit',
            'update' => 'update',
            'create' => 'create',
            'store' => 'create',
            'destroy' => 'delete',
            'delete' => 'delete',
        ];
        
        return $actions[$action] ?? $action;
    }

    /**
     * Check if the exception is a database error (connection or table-related)
     */
    private function isDatabaseError(Throwable $e): bool
    {
        // Check for PDO error codes
        $code = $e->getCode();
        
        // Common database error codes
        if (in_array($code, [2002, 1045, 1049, 1146, 1054, 1064, 1146])) {
            return true;
        }
        
        $message = $e->getMessage();
        
        // Check for SQLSTATE patterns
        if (preg_match('/SQLSTATE\[\d+\]/', $message)) {
            return true;
        }
        
        // Check for common database error indicators
        $databaseErrors = [
            // Connection errors
            'Connection refused',
            'Connection timed out',
            'Connection reset',
            'Broken pipe',
            'No route to host',
            'Network is unreachable',
            // Table/column errors
            'Base table or view not found',
            'Table.*doesn\'t exist',
            'Unknown column',
            'Unknown database',
            'Access denied',
            // General SQL errors
            'SQLSTATE',
            'PDOException',
            'syntax error',
        ];
        
        foreach ($databaseErrors as $error) {
            if (preg_match('/' . $error . '/i', $message)) {
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