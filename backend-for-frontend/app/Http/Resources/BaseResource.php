<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BaseResource extends JsonResource
{
    /**
     * Safely convert a timestamp to ISO string format.
     * Handles Carbon instances, DateTime, strings, and null values.
     */
    protected function formatTimestamp($timestamp): ?string
    {
        if ($timestamp === null) {
            return null;
        }

        // If it's already a string, return as-is
        if (is_string($timestamp)) {
            return $timestamp;
        }

        // If it's a Carbon or DateTime instance, convert to ISO string
        if ($timestamp instanceof \Carbon\Carbon || $timestamp instanceof \DateTime) {
            return $timestamp->format(\DateTime::ATOM);
        }

        return null;
    }
}
