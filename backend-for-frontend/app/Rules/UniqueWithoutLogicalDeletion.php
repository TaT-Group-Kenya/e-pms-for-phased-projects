<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\InvokableRule;
use Illuminate\Support\Facades\DB;

class UniqueWithoutLogicalDeletion implements InvokableRule
{
    public function __construct(
        private string $table,
        private string $column,
        private ?int $ignoreId = null,
    ) {}

    public function __invoke(string $attribute, mixed $value, \Closure $fail): void
    {
        if ($value === null || $value === '') {
            return;
        }

        $query = DB::table($this->table)
            ->where($this->column, $value)
            ->where('is_deleted', false);

        if ($this->ignoreId !== null) {
            $query->where('id', '<>', $this->ignoreId);
        }

        if ($query->exists()) {
            $fail("The {$attribute} has already been taken.");
        }
    }
}
