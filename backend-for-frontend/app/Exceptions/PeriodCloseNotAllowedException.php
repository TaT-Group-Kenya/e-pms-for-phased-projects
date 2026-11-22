<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Thrown when an attempt is made to close the current or a future month.
 * Months are only closeable after they have completely ended.
 */
class PeriodCloseNotAllowedException extends RuntimeException
{
}
