<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasLogicalDeletion
{
    protected static function bootHasLogicalDeletion(): void
    {
        static::addGlobalScope('not_deleted', function (Builder $builder) {
            $table = $builder->getModel()->getTable();
            $builder->where($table . '.is_deleted', false);
        });
    }

    public function scopeWithDeleted(Builder $query): Builder
    {
        return $query->withoutGlobalScope('not_deleted');
    }

    public function scopeOnlyDeleted(Builder $query): Builder
    {
        $table = $query->getModel()->getTable();

        return $query
            ->withoutGlobalScope('not_deleted')
            ->where($table . '.is_deleted', true);
    }

    public function softDelete(?int $deletedBy = null): bool
    {
        $this->is_deleted = true;
        $this->deleted_at = now();

        if (!is_null($deletedBy)) {
            $this->deleted_by = $deletedBy;
        }

        return $this->save();
    }

    public function restore(): bool
    {
        $this->is_deleted = false;
        $this->deleted_at = null;
        $this->deleted_by = null;

        return $this->save();
    }
}
