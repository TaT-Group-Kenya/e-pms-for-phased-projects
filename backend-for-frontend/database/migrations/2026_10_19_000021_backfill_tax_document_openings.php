<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Backfill: open the full tax position (DR) for customer debit notes,
     * company invoices and customer debit notes that already exist, at
     * their stored forex rates. Runs safely wherever the feature deploys:
     * idempotent per document (skips documents that already have a DR row)
     * and skips gracefully when a table/column does not exist.
     */
    public function up(): void
    {
        $hasSide = Schema::hasTable('tax_transactions')
            && \Illuminate\Support\Facades\Schema::hasColumn('tax_transactions', 'side');

        if (! $hasSide) {
            return;
        }

        $directionCollected = \App\Services\TaxTransactionService::DIRECTION_COLLECTED;
        $directionPaid = \App\Services\TaxTransactionService::DIRECTION_PAID;

        // 1) Customer invoices (tax collected on customer payments).
        if (Schema::hasTable('cust_invoices')
            && Schema::hasColumn('cust_invoices', 'forex_rate')) {
            $invoices = DB::table('cust_invoices')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'invoice_number', 'tax_amount', 'currency', 'forex_rate', 'customer_id']);

            foreach ($invoices as $invoice) {
                \App\Services\TaxTransactionService::openDocumentTax(
                    'cust_invoice',
                    (int) $invoice->id,
                    (float) $invoice->tax_amount,
                    $invoice->currency,
                    (float) $invoice->forex_rate,
                    null,
                    'Full tax opened on invoice '.$invoice->invoice_number.' (backfill)',
                    $directionCollected
                );
            }
        }

        // 2) Customer debit notes (tax collected like invoices).
        if (Schema::hasTable('cust_debit_notes')
            && Schema::hasColumn('cust_debit_notes', 'tax_amount')) {
            $debitNotes = DB::table('cust_debit_notes')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'debit_note_number', 'tax_amount', 'currency']);

            foreach ($debitNotes as $note) {
                \App\Services\TaxTransactionService::openDocumentTax(
                    'customer_debit_note',
                    (int) $note->id,
                    (float) $note->tax_amount,
                    $note->currency,
                    null,
                    null,
                    'Full tax opened on debit note '.$note->debit_note_number.' (backfill)',
                    $directionCollected
                );
            }
        }

        // 3) Company invoices (tax recoverable on vendor bills).
        if (Schema::hasTable('company_invoices')
            && Schema::hasColumn('company_invoices', 'tax_amount')) {
            $companyInvoices = DB::table('company_invoices')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'invoice_number', 'tax_amount', 'currency', 'company_id']);

            foreach ($companyInvoices as $invoice) {
                \App\Services\TaxTransactionService::openDocumentTax(
                    'company_invoice',
                    (int) $invoice->id,
                    (float) $invoice->tax_amount,
                    $invoice->currency,
                    (float) ($invoice->forex_rate ?? 1),
                    null,
                    'Recoverable tax opened on vendor invoice '.$invoice->invoice_number.' (backfill)',
                    $directionPaid
                );
            }
        }
    }

    public function down(): void
    {
        // Remove the backfilled DR rows only (movement CR rows are kept).
        if (Schema::hasTable('tax_transactions')) {
            DB::table('tax_transactions')
                ->where('side', \App\Services\TaxTransactionService::SIDE_DR)
                ->where('narration', 'like', '%(backfill)')
                ->delete();
        }
    }
};
