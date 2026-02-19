<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SysRole;

class SysRoleSeeder extends Seeder
{
    public function run(): void
    {
        $bases = [
            'ACCOUNT',
            'ACCOUNT_TYPE',
            'ACCOUNT_GROUP',
            'COMPANY',
            'COMPANY_BANK',
            'COMPANY_CREDIT_NOTE',
            'COMPANY_CREDIT_NOTE_ITEM',
            'COMPANY_CREDIT_NOTE_TAX_ITEM',
            'COMPANY_INVOICE',
            'COMPANY_INVOICE_DOCUMENT',
            'COMPANY_INVOICE_ITEM',
            'COMPANY_INVOICE_TAX_ITEM',
            'COMPANY_PAYMENT',
            'COMPANY_PROJECT',
            'COUNTRY',
            'CURRENCY',
            'CUST_CREDIT_NOTE',
            'CUST_CREDIT_NOTE_ITEM',
            'CUST_CREDIT_NOTE_TAX_ITEM',
            'CUST_INVOICE',
            'CUST_INVOICE_DOCUMENT',
            'CUST_INVOICE_ITEM',
            'CUST_INVOICE_TAX_ITEM',
            'CUST_PAYMENT_ALLOCATION',
            'CUSTOMER',
            'DEPARTMENT',
            'DOWNLOAD',
            'GROUP_ROLE',
            'LANGUAGE',
            'ORDER',
            'ORDER_DOCUMENT',
            'ORDER_ITEM',
            'ORDER_TAX_ITEM',
            'PAYMENT_METHOD',
            'PROJECT',
            'PROJECT_CATEGORY',
            'PROJECT_PHASE',
            'PROJECT_PROGRESS_UPDATE',
            'QUOTATION',
            'QUOTE_DOCUMENT',
            'QUOTE_LINE_ITEM',
            'SYS_CONFIG',
            'SYS_GROUP',
            'SYS_ROLE',
            'TAX',
            'TRANSACTION',
            'USER',
            'USER_GROUP',
        ];

        $actions = ['ADD', 'EDIT', 'DELETE', 'VIEW'];

        foreach ($bases as $base) {
            foreach ($actions as $action) {
                $role = "ROLE_{$action}_{$base}";
                SysRole::firstOrCreate(
                    ['name' => $role],
                    ['description' => null, 'updated_by' => 1, 'created_by' => 1]
                );
            }
        }
    }
}
