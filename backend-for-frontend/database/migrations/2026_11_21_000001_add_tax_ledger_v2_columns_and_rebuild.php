<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tax ledger v2 — rewrites the ledger into an ordered, KES-denominated
     * list of VAT movements with a running liability balance.
     *
     *  - entry_type VAT_OUT (credit side): output VAT declared — sent
     *    customer invoices, raised customer debit notes, raised company
     *    credit notes.
     *  - entry_type VAT_IN (debit side): input/recoverable VAT — sent
     *    company invoices, raised customer credit notes.
     *  - entry_type Balancing: signed correction rows for documents edited
     *    or deleted after posting (originals kept for audit).
     *
     * converted_amount stores the signed KES effect (positive VAT_OUT,
     * negative VAT_IN); running_balance the cumulative liability.
     *
     * Legacy rows — payment-time "collected"/"paid" movements and document
     * DR openings — no longer match the document-position model, so the
     * ledger is cleared and rebuilt once from the current document state.
     */
    public function up(): void
    {
        $hasTable = Schema::hasTable('tax_transactions');

        if ($hasTable && ! Schema::hasColumn('tax_transactions', 'supplier_or_customer')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->unsignedBigInteger('supplier_or_customer')->nullable()->after('company_id');
            });
        }

        if ($hasTable && ! Schema::hasColumn('tax_transactions', 'kra_pin')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->string('kra_pin', 64)->nullable()->after('supplier_or_customer');
            });
        }

        if ($hasTable && ! Schema::hasColumn('tax_transactions', 'entry_type')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->string('entry_type', 20)->nullable()->after('side');
            });
        }

        if ($hasTable && ! Schema::hasColumn('tax_transactions', 'running_balance')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->decimal('running_balance', 15, 2)->nullable()->after('converted_amount');
            });
        }

        if ($hasTable && ! Schema::hasIndex('tax_transactions', 'tax_txn_entry_type_date_index')) {
            Schema::table('tax_transactions', function (Blueprint $table) {
                $table->index(['entry_type', 'transaction_date'], 'tax_txn_entry_type_date_index');
            });
        }

        if ($hasTable) {
            DB::table('tax_transactions')->delete();

            $this->rebuildFromDocuments();
        }
    }

    public function down(): void
    {
        Schema::table('tax_transactions', function (Blueprint $table) {
            $table->dropIndex('tax_txn_entry_type_date_index');
            $table->dropColumn(['supplier_or_customer', 'kra_pin', 'entry_type', 'running_balance']);
        });
    }

    protected function rebuildFromDocuments(): void
    {
        if (! Schema::hasTable('tax_transactions')) {
            return;
        }

        $chart2000 = Schema::hasTable('chart_of_accounts')
            ? (int) DB::table('chart_of_accounts')->where('code', '2000')->value('id')
            : 0;

        $positions = [];

        // Customer invoices: output VAT once the invoice left draft.
        if (Schema::hasTable('cust_invoices') && Schema::hasColumn('cust_invoices', 'forex_rate')) {
            foreach (DB::table('cust_invoices')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'invoice_number', 'tax_amount', 'currency', 'forex_rate', 'customer_id', 'status', 'created_at']) as $invoice) {
                if ($this->leftDraft($invoice->status)) {
                    $positions[] = [
                        'date' => (string) ($invoice->created_at ?? now()),
                        'side' => 'cr',
                        'entry_type' => 'VAT_OUT',
                        'source_type' => 'cust_invoice',
                        'source_id' => (int) $invoice->id,
                        'tax' => (float) $invoice->tax_amount,
                        'currency' => $invoice->currency,
                        'rate' => (float) $invoice->forex_rate,
                        'party' => ['customer', (int) $invoice->customer_id],
                        'narration' => 'Output VAT on invoice '.$invoice->invoice_number.' (backfill)',
                    ];
                }
            }
        }

        // Customer debit notes: output VAT once raised.
        if (Schema::hasTable('cust_debit_notes')) {
            foreach (DB::table('cust_debit_notes')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'debit_note_number', 'tax_amount', 'currency', 'invoice_id', 'status', 'created_at']) as $note) {
                if ($this->leftDraft($note->status)) {
                    $customer = $note->invoice_id
                        ? DB::table('cust_invoices')->find($note->invoice_id)
                        : null;
                    $positions[] = [
                        'date' => (string) ($note->created_at ?? now()),
                        'side' => 'cr',
                        'entry_type' => 'VAT_OUT',
                        'source_type' => 'customer_debit_note',
                        'source_id' => (int) $note->id,
                        'tax' => (float) $note->tax_amount,
                        'currency' => $note->currency,
                        'rate' => 1.0,
                        'party' => ['customer', (int) ($customer->customer_id ?? 0)],
                        'narration' => 'Output VAT on debit note '.$note->debit_note_number.' (backfill)',
                    ];
                }
            }
        }

        // Customer credit notes: reduce output VAT once raised.
        if (Schema::hasTable('cust_credit_notes')) {
            foreach (DB::table('cust_credit_notes')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'credit_note_number', 'tax_amount', 'currency', 'invoice_id', 'status', 'created_at']) as $note) {
                if ($this->leftDraft($note->status)) {
                    $invoice = $note->invoice_id ? DB::table('cust_invoices')->find($note->invoice_id) : null;
                    $positions[] = [
                        'date' => (string) ($note->created_at ?? now()),
                        'side' => 'dr',
                        'entry_type' => 'VAT_IN',
                        'source_type' => 'cust_credit_note',
                        'source_id' => (int) $note->id,
                        'tax' => (float) $note->tax_amount,
                        'currency' => $note->currency,
                        'rate' => 1.0,
                        'party' => ['customer', (int) ($invoice->customer_id ?? 0)],
                        'narration' => 'VAT reduction for credit note '.$note->credit_note_number.' (backfill)',
                    ];
                }
            }
        }

        // Company invoices: recoverable (input) VAT once sent.
        if (Schema::hasTable('company_invoices')) {
            foreach (DB::table('company_invoices')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'invoice_number', 'tax_amount', 'currency', 'company_id', 'status', 'created_at']) as $invoice) {
                if ($this->leftDraft($invoice->status)) {
                    $positions[] = [
                        'date' => (string) ($invoice->created_at ?? now()),
                        'side' => 'dr',
                        'entry_type' => 'VAT_IN',
                        'source_type' => 'company_invoice',
                        'source_id' => (int) $invoice->id,
                        'tax' => (float) $invoice->tax_amount,
                        'currency' => $invoice->currency,
                        'rate' => 1.0,
                        'party' => ['company', (int) $invoice->company_id],
                        'narration' => 'Recoverable VAT on company invoice '.$invoice->invoice_number.' (backfill)',
                    ];
                }
            }
        }

        // Company credit notes: reduce recoverable VAT once raised. The
        // party is reached through the parent invoice (the table itself has
        // no company_id column).
        if (Schema::hasTable('company_credit_notes')) {
            foreach (DB::table('company_credit_notes')
                ->where('is_deleted', false)
                ->where('tax_amount', '>', 0)
                ->get(['id', 'credit_note_number', 'tax_amount', 'currency', 'invoice_id', 'status', 'created_at']) as $note) {
                if ($this->leftDraft($note->status)) {
                    $company = $note->invoice_id
                        ? DB::table('company_invoices')->find($note->invoice_id)
                        : null;
                    $positions[] = [
                        'date' => (string) ($note->created_at ?? now()),
                        'side' => 'cr',
                        'entry_type' => 'VAT_OUT',
                        'source_type' => 'company_credit_note',
                        'source_id' => (int) $note->id,
                        'tax' => (float) $note->tax_amount,
                        'currency' => $note->currency,
                        'rate' => 1.0,
                        'party' => ['company', (int) ($company->company_id ?? 0)],
                        'narration' => 'Output VAT reversal for company credit note '.$note->credit_note_number.' (backfill)',
                    ];
                }
            }
        }

        usort($positions, fn ($a, $b) => strcmp($a['date'], $b['date']));

        $running = 0.0;
        $inserts = [];
        foreach ($positions as $position) {
            [$partyType, $partyId] = $position['party'];
            $kes = round($position['tax'] * $position['rate'], 2);
            $signed = $position['entry_type'] === 'VAT_OUT' ? $kes : -$kes;
            $running = round($running + $signed, 2);

            $inserts[] = [
                'transaction_number' => 'TAX-'.substr(md5($position['source_type'].$position['source_id'].$position['entry_type']), 0, 18),
                'tax_id' => null,
                'side' => $position['side'],
                'direction' => $position['side'] === 'cr' ? 'collected' : 'paid',
                'chart_of_account' => $chart2000,
                'entry_type' => $position['entry_type'],
                'amount' => $position['tax'],
                'transaction_currency' => $position['currency'],
                'exchange_rate' => $position['rate'],
                'converted_amount' => $signed,
                'running_balance' => $running,
                'transaction_date' => substr($position['date'], 0, 10),
                'posted_date' => now()->toDateString(),
                'customer_id' => $partyType === 'customer' && $partyId ? $partyId : null,
                'company_id' => $partyType === 'company' && $partyId ? $partyId : null,
                'supplier_or_customer' => $partyId ?: null,
                'kra_pin' => $this->partyKraPin($partyType, $partyId),
                'source_type' => $position['source_type'],
                'source_id' => $position['source_id'],
                'payment_id' => null,
                'narration' => $position['narration'],
                'created_at' => $position['date'],
                'updated_at' => now(),
                'created_by' => null,
                'updated_by' => null,
                'is_deleted' => false,
                'deleted_at' => null,
                'deleted_by' => null,
            ];
        }

        foreach (array_chunk($inserts, 500) as $chunk) {
            DB::table('tax_transactions')->insert($chunk);
        }
    }

    protected function partyKraPin(string $partyType, int $partyId): ?string
    {
        if ($partyId <= 0) {
            return null;
        }

        try {
            $pin = $partyType === 'company'
                ? DB::table('companies')->where('id', $partyId)->value('kra_pin')
                : DB::table('customers')->where('id', $partyId)->value('kra_pin');

            return $pin ? (string) $pin : null;
        } catch (Throwable) {
            return null;
        }
    }

    protected function leftDraft(?string $status): bool
    {
        return ! in_array($status, ['draft', 'cancelled'], true);
    }
};
