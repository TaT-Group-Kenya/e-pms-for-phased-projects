<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AddLoansAccountGroup extends Migration
{
    public function up(): void
    {
        // Register the new account group alongside PETTY/CHECKING/SAVINGS.
        // Inserting keeps existing groups untouched and is idempotent.
        $existing = DB::table('account_groups')->where('name', 'LOANS')->first();

        if ($existing) {
            return;
        }

        $nextId = (int) DB::table('account_groups')->max('id') + 1;

        DB::table('account_groups')->insert([
            'id' => $nextId,
            'name' => 'LOANS',
            'description' => 'Loans',
            'created_at' => now(),
            'updated_at' => now(),
            'created_by' => 1,
            'updated_by' => 1,
            'is_deleted' => false,
        ]);

        // Allow the new group on the accounts.group enum column so accounts
        // can actually reference it.
        $accountsTable = (new \App\Models\Account)->getTable();
        DB::statement("ALTER TABLE {$accountsTable} MODIFY COLUMN `group` ENUM('Petty','Checking','Savings','Loans') NOT NULL");
    }

    public function down(): void
    {
        // Make sure no account is still using the group before shrinking
        // the enum in reverse.
        $accountsTable = (new \App\Models\Account)->getTable();
        DB::table($accountsTable)->where('group', 'Loans')->update(['group' => 'Checking']);

        DB::statement("ALTER TABLE {$accountsTable} MODIFY COLUMN `group` ENUM('Petty','Checking','Savings') NOT NULL");

        DB::table('account_groups')->where('name', 'LOANS')->delete();
    }
}