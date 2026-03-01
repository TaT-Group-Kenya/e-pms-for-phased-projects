<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\SysRole;

return new class extends Migration
{
    public function up(): void
    {
        $roles = [
            // CompanyTransactionsLedger
            'ROLE_ADD_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_EDIT_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_DELETE_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER',

            // CustomerTransactionsLedger
            'ROLE_ADD_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_EDIT_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_DELETE_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER',

            // ProjectLocation
            'ROLE_ADD_PROJECT_LOCATION',
            'ROLE_EDIT_PROJECT_LOCATION',
            'ROLE_DELETE_PROJECT_LOCATION',
            'ROLE_VIEW_PROJECT_LOCATION',

            // ProjectSourceOrigin
            'ROLE_ADD_PROJECT_SOURCE_ORIGIN',
            'ROLE_EDIT_PROJECT_SOURCE_ORIGIN',
            'ROLE_DELETE_PROJECT_SOURCE_ORIGIN',
            'ROLE_VIEW_PROJECT_SOURCE_ORIGIN',
        ];

        foreach ($roles as $role) {
            SysRole::firstOrCreate(
                ['name' => $role],
                [
                    'description' => null,
                    'created_by'  => 1,
                    'updated_by'  => 1,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]
            );
        }
    }

    public function down(): void
    {
        $roles = [
            'ROLE_ADD_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_EDIT_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_DELETE_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_VIEW_COMPANY_TRANSACTIONS_LEDGER',
            'ROLE_ADD_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_EDIT_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_DELETE_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_VIEW_CUSTOMER_TRANSACTIONS_LEDGER',
            'ROLE_ADD_PROJECT_LOCATION',
            'ROLE_EDIT_PROJECT_LOCATION',
            'ROLE_DELETE_PROJECT_LOCATION',
            'ROLE_VIEW_PROJECT_LOCATION',
            'ROLE_ADD_PROJECT_SOURCE_ORIGIN',
            'ROLE_EDIT_PROJECT_SOURCE_ORIGIN',
            'ROLE_DELETE_PROJECT_SOURCE_ORIGIN',
            'ROLE_VIEW_PROJECT_SOURCE_ORIGIN',
        ];

        SysRole::whereIn('name', $roles)->delete();
    }
};
