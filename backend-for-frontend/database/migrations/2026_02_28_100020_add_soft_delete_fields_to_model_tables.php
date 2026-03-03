<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'accounts',
            'account_groups',
            'account_types',
            'companies',
            'company_banks',
            'company_credit_notes',
            'company_credit_note_items',
            'company_credit_note_tax_items',
            'company_invoices',
            'company_invoice_documents',
            'company_invoice_items',
            'company_invoice_tax_items',
            'company_payments',
            'company_projects',
            'countries',
            'currencies',
            'cust_credit_notes',
            'cust_credit_note_items',
            'cust_credit_note_tax_items',
            'cust_invoices',
            'cust_invoice_documents',
            'cust_invoice_items',
            'cust_invoice_tax_items',
            'cust_payments',
            'cust_payment_allocations',
            'customers',
            'departments',
            'downloads',
            'group_roles',
            'languages',
            'orders',
            'order_documents',
            'order_items',
            'order_tax_items',
            'payment_methods',
            'projects',
            'project_categories',
            'project_phases',
            'project_progress_updates',
            'quotations',
            'quotation_tax_items',
            'quote_approvals',
            'quote_documents',
            'quote_line_items',
            'sys_configs',
            'sys_groups',
            'sys_roles',
            'taxes',
            'transactions',
            'users',
            'user_groups',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (!Schema::hasColumn($tableName, 'is_deleted')) {
                        $table->boolean('is_deleted')->default(false);
                    }
                    if (!Schema::hasColumn($tableName, 'deleted_at')) {
                        $table->timestamp('deleted_at')->nullable();
                    }
                    if (!Schema::hasColumn($tableName, 'deleted_by')) {
                        $table->unsignedBigInteger('deleted_by')->nullable();
                    }
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'accounts',
            'account_groups',
            'account_types',
            'companies',
            'company_banks',
            'company_credit_notes',
            'company_credit_note_items',
            'company_credit_note_tax_items',
            'company_invoices',
            'company_invoice_documents',
            'company_invoice_items',
            'company_invoice_tax_items',
            'company_payments',
            'company_projects',
            'countries',
            'currencies',
            'cust_credit_notes',
            'cust_credit_note_items',
            'cust_credit_note_tax_items',
            'cust_invoices',
            'cust_invoice_documents',
            'cust_invoice_items',
            'cust_invoice_tax_items',
            'cust_payments',
            'cust_payment_allocations',
            'customers',
            'departments',
            'downloads',
            'group_roles',
            'languages',
            'orders',
            'order_documents',
            'order_items',
            'order_tax_items',
            'payment_methods',
            'projects',
            'project_categories',
            'project_phases',
            'project_progress_updates',
            'quotations',
            'quotation_tax_items',
            'quote_approvals',
            'quote_documents',
            'quote_line_items',
            'sys_configs',
            'sys_groups',
            'sys_roles',
            'taxes',
            'transactions',
            'users',
            'user_groups',
        ];

        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName)) {
                Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                    if (Schema::hasColumn($tableName, 'is_deleted')) {
                        $table->dropColumn('is_deleted');
                    }
                    if (Schema::hasColumn($tableName, 'deleted_at')) {
                        $table->dropColumn('deleted_at');
                    }
                    if (Schema::hasColumn($tableName, 'deleted_by')) {
                        $table->dropColumn('deleted_by');
                    }
                });
            }
        }
    }
};
