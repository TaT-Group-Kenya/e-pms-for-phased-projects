<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Thrown when an operation would modify financial records inside a closed
 * accounting period. Rendered by the exception handler as HTTP 423 with a
 * structured payload so the UI can surface a clear message.
 */
class PeriodLockedException extends RuntimeException
{
    public function __construct(
        string $message,
        public readonly ?string $date = null,
        public readonly ?int $periodId = null,
        public readonly ?string $periodName = null,
    ) {
        parent::__construct($message);
    }
}
