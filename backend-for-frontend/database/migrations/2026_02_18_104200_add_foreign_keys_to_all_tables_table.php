<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->foreign('transaction_id')->references('id')->on('transactions')->onDelete('set null');
            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('set null');
        });

        Schema::table('company_credit_note_items', function (Blueprint $table) {
            $table->foreign('credit_note_id')->references('id')->on('company_credit_notes')->onDelete('cascade');
        });

        Schema::table('user_groups', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sys_group_id')->references('id')->on('sys_groups')->onDelete('cascade');
        });

        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            $table->foreign('credit_note_id')->references('id')->on('cust_credit_notes')->onDelete('cascade');
        });

        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->foreign('credit_note_id')->references('id')->on('company_credit_notes')->onDelete('cascade');
        });

        Schema::table('company_invoice_items', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('quote_documents', function (Blueprint $table) {
            $table->foreign('quotation_id')->references('id')->on('quotations')->onDelete('cascade');
        });

        Schema::table('order_documents', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        Schema::table('company_credit_notes', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
        });

        Schema::table('project_progress_updates', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('cust_payment_allocations', function (Blueprint $table) {
            $table->foreign('payment_id')->references('id')->on('cust_payments')->onDelete('cascade');
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        Schema::table('company_invoices', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('cust_payments', function (Blueprint $table) {
            $table->foreign('transaction_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });

        Schema::table('company_banks', function (Blueprint $table) {
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
            $table->foreign('related_transaction_id')->references('id')->on('transactions')->onDelete('set null');
            $table->foreign('cost_center_id')->references('id')->on('departments')->onDelete('set null');
        });

        Schema::table('cust_invoice_documents', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('quotation_id')->references('id')->on('quotations')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->foreign('credit_note_id')->references('id')->on('cust_credit_notes')->onDelete('cascade');
        });

        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        Schema::table('cust_invoice_items', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('cust_credit_notes', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });

        Schema::table('quote_line_items', function (Blueprint $table) {
            $table->foreign('quotation_id')->references('id')->on('quotations')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->foreign('project_category_id')->references('id')->on('project_categories')->onDelete('cascade');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('project_phase_id')->references('id')->on('project_phases')->onDelete('cascade');
        });

        Schema::table('project_phases', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });

        Schema::table('group_roles', function (Blueprint $table) {
            $table->foreign('group_id')->references('id')->on('sys_groups')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('sys_roles')->onDelete('cascade');
        });

        Schema::table('company_projects', function (Blueprint $table) {
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('phase_id')->references('id')->on('project_phases')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });

        Schema::table('company_invoice_documents', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('company_invoices')->onDelete('cascade');
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->foreign('invoice_id')->references('id')->on('cust_invoices')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_payments', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('company_credit_note_items', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
        });

        Schema::table('user_groups', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['sys_group_id']);
        });

        Schema::table('cust_credit_note_items', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
        });

        Schema::table('company_credit_note_tax_items', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
        });

        Schema::table('company_invoice_items', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('quote_documents', function (Blueprint $table) {
            $table->dropForeign(['quotation_id']);
        });

        Schema::table('order_documents', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('company_credit_notes', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('project_progress_updates', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('cust_payment_allocations', function (Blueprint $table) {
            $table->dropForeign(['payment_id']);
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['customer_id']);
        });

        Schema::table('cust_invoices', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['project_id']);
            $table->dropForeign(['customer_id']);
        });

        Schema::table('company_invoices', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['company_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('cust_payments', function (Blueprint $table) {
            $table->dropForeign(['transaction_id']);
        });

        Schema::table('company_banks', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
        });

        Schema::table('company_invoice_tax_items', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['company_id']);
            $table->dropForeign(['related_transaction_id']);
            $table->dropForeign(['cost_center_id']);
        });

        Schema::table('cust_invoice_documents', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['quotation_id']);
            $table->dropForeign(['project_id']);
            $table->dropForeign(['customer_id']);
        });

        Schema::table('cust_credit_note_tax_items', function (Blueprint $table) {
            $table->dropForeign(['credit_note_id']);
        });

        Schema::table('order_tax_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
        });

        Schema::table('cust_invoice_items', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('cust_credit_notes', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('quote_line_items', function (Blueprint $table) {
            $table->dropForeign(['quotation_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['project_category_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['order_id']);
            $table->dropForeign(['project_phase_id']);
        });

        Schema::table('project_phases', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
        });

        Schema::table('group_roles', function (Blueprint $table) {
            $table->dropForeign(['group_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::table('company_projects', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['phase_id']);
            $table->dropForeign(['company_id']);
        });

        Schema::table('company_invoice_documents', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });

        Schema::table('cust_invoice_tax_items', function (Blueprint $table) {
            $table->dropForeign(['invoice_id']);
        });
    
    }
};
