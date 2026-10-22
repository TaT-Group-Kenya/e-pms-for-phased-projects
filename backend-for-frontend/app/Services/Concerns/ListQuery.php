<?php

namespace App\Services\Concerns;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

/**
 * Shared listing behaviour for index queries: whitelisted equality filters,
 * a bounded free-text search across declared columns, and pagination.
 *
 * Each service declares its own searchable/filterable column lists in the
 * `listSearchable` / `listFilterable` properties, so the request never
 * reaches the database with unvalidated column names.
 */
trait ListQuery
{
    /**
     * Apply the shared logical-deletion visibility flags (`with_deleted`,
     * `only_deleted`) and remove them from the filter array. Models using
     * `HasLogicalDeletion` hide soft-deleted rows via a global scope; these
     * keys opt back in.
     *
     * @param  array<string, mixed>  $filters
     */
    public function applyLogicalDeletion(Builder $query, array &$filters): Builder
    {
        $withDeleted = filter_var($filters['with_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);
        $onlyDeleted = filter_var($filters['only_deleted'] ?? null, FILTER_VALIDATE_BOOLEAN);

        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($onlyDeleted) {
            $query->onlyDeleted();
        } elseif ($withDeleted) {
            $query->withDeleted();
        }

        return $query;
    }

    /**
     * Apply listing filters to the given query.
     *
     * `search` OR-LIKEs across the service's searchable columns; every other
     * filter is an equality match against the whitelisted columns. Blank and
     * "all" values are skipped, and unknown keys are ignored — an unknown
     * column would otherwise become a blind `where($key, ...)` and fail.
     *
     * @param  array<string, mixed>  $filters
     */
    public function applyListFilters(Builder $query, array &$filters): Builder
    {
        $searchable = (array) ($this->listSearchable ?? []);
        $filterable = (array) ($this->listFilterable ?? []);

        $search = trim((string) ($filters['search'] ?? ''));
        unset($filters['search']);

        // Skip the logical-deletion visibility flags; callers that support
        // them handle these keys via applyLogicalDeletion() before this.
        unset($filters['with_deleted'], $filters['only_deleted']);

        if ($search !== '' && $searchable !== []) {
            $like = '%'.strtolower($search).'%';
            $query->where(function (Builder $q) use ($like, $searchable) {
                foreach ($searchable as $column) {
                    $q->orWhereRaw('LOWER('.$column.') LIKE ?', [$like]);
                }
            });
        }

        foreach ($filters as $key => $value) {
            if ($value === null || $value === '' || $value === 'all') {
                continue;
            }
            if (! in_array($key, $filterable, true)) {
                continue;
            }
            $query->where($key, $value);
        }

        // Optional date-range filters; each service opts in with its business
        // date column (transactions use posted_date when set).
        $dateColumn = (string) ($this->listDateColumn ?? '');
        if ($dateColumn !== '') {
            if (! empty($filters['date_from'])) {
                $query->whereDate($dateColumn, '>=', $filters['date_from']);
            }
            if (! empty($filters['date_to'])) {
                $query->whereDate($dateColumn, '<=', $filters['date_to']);
            }
        }
        unset($filters['date_from'], $filters['date_to']);

        return $query;
    }

    /**
     * Paginate with the shared defaults used across list endpoints
     * (per-page clamped to at most 500, page at least 1, id-descending).
     *
     * @param  array<string, mixed>  $filters
     */
    public function paginateList(
        Builder $query,
        array &$filters,
        int $perPage = 15,
        int $page = 1,
        $orderBy = 'id',
    ): LengthAwarePaginator {
        $query = $this->applyListFilters($query, $filters);
        $perPage = max(1, min($perPage, 500));
        $page = max(1, $page);

        return $query->orderBy($orderBy)->paginate($perPage, ['*'], 'page', $page);
    }
}