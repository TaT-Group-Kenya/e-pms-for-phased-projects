<?php

namespace App\Services;

use App\Models\Company;
use App\Models\CompanyCreditNote;
use App\Models\CompanyInvoice;
use App\Models\CustCreditNote;
use App\Models\CustDebitNote;
use App\Models\CustInvoice;
use App\Models\Customer;
use App\Models\TaxTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Throwable;

/**
 * VAT ledger — one ordered, KES-denominated list of movements with a
 * running liability balance.
 *
 *  - VAT_OUT (credit side): output VAT declared. Written once the document
 *    leaves draft: sent customer invoices, raised customer debit notes and
 *    raised company credit notes.
 *  - VAT_IN (debit side): input/recoverable VAT. Written once the document
 *    leaves draft: sent company invoices and raised customer credit notes.
 *  - Balancing: signed correction used to restate a document's previously
 *    posted VAT after an edit, deletion or reversion back to draft. The
 *    original entry is never mutated or removed, so the audit trail stays
 *    intact.
 *
 * Sign convention: VAT_OUT increases the liability (+), VAT_IN reduces it
 * (−). converted_amount is the signed KES effect; running_balance the
 * cumulative liability after the entry.
 */
class TaxTransactionService
{
    /** Tax payable chart — all VAT positions are booked against it. */
    public const CHART_TAX_PAYABLE_CODE = '2000';

    public const DIRECTION_COLLECTED = 'collected';

    public const DIRECTION_PAID = 'paid';

    public const SIDE_DR = 'dr';

    public const SIDE_CR = 'cr';

    public const ENTRY_VAT_OUT = 'VAT_OUT';

    public const ENTRY_VAT_IN = 'VAT_IN';

    public const ENTRY_BALANCING = 'Balancing';

    /**
     * Post the output-VAT position of a customer invoice so the ledger
     * reflects its current (sent-or-later) tax total; reverses through a
     * Balancing entry when the invoice returns to draft or is edited.
     */
    public static function syncInvoicePosition(CustInvoice $invoice): void
    {
        $rate = self::invoiceForexRate($invoice);

        self::syncDocument(
            'cust_invoice',
            (int) $invoice->id,
            round((float) $invoice->tax_amount, 2),
            $invoice->status,
            $invoice->currency,
            $rate,
            'customer',
            $invoice->customer_id ? (int) $invoice->customer_id : null,
            $invoice->invoice_number,
            self::ENTRY_VAT_OUT,
            $invoice->created_at
        );
    }

    /**
     * Post or restate a customer debit note's VAT position (raised = VAT_OUT).
     */
    public static function syncDebitNotePosition(CustDebitNote $note): void
    {
        $customer = $note->invoice?->customer_id;

        self::syncDocument(
            'customer_debit_note',
            (int) $note->id,
            round((float) $note->tax_amount, 2),
            $note->status,
            $note->currency,
            1.0,
            'customer',
            $customer ? (int) $customer : null,
            $note->debit_note_number,
            self::ENTRY_VAT_OUT,
            $note->updated_at ?: $note->created_at
        );
    }

    /**
     * Post or restate a customer credit note's VAT position (raised = VAT_IN).
     */
    public static function syncCreditNotePosition(CustCreditNote $note): void
    {
        $customer = $note->invoice?->customer_id;

        self::syncDocument(
            'cust_credit_note',
            (int) $note->id,
            round((float) $note->tax_amount, 2),
            $note->status,
            $note->currency,
            1.0,
            'customer',
            $customer ? (int) $customer : null,
            $note->credit_note_number,
            self::ENTRY_VAT_IN,
            $note->updated_at ?: $note->created_at
        );
    }

    /**
     * Post or restate a company invoice's VAT position (sent = VAT_IN).
     */
    public static function syncCompanyInvoicePosition(CompanyInvoice $invoice): void
    {
        self::syncDocument(
            'company_invoice',
            (int) $invoice->id,
            round((float) $invoice->tax_amount, 2),
            $invoice->status,
            $invoice->currency,
            1.0,
            'company',
            $invoice->company_id ? (int) $invoice->company_id : null,
            $invoice->invoice_number,
            self::ENTRY_VAT_IN,
            $invoice->created_at
        );
    }

    /**
     * Post or restate a company credit note's VAT position (raised = VAT_OUT).
     * The note table carries no company_id, so the party resolves through
     * the parent company invoice.
     */
    public static function syncCompanyCreditNotePosition(CompanyCreditNote $note): void
    {
        $company = $note->invoice?->company_id;

        self::syncDocument(
            'company_credit_note',
            (int) $note->id,
            round((float) $note->tax_amount, 2),
            $note->status,
            $note->currency,
            1.0,
            'company',
            $company ? (int) $company : null,
            $note->credit_note_number,
            self::ENTRY_VAT_OUT,
            $note->updated_at ?: $note->created_at
        );
    }

    /**
     * Shared sync: compare the document's desired position to the net of
     * previously posted entries and post either the first VAT_OUT/VAT_IN
     * entry or a signed Balancing correction to restate it.
     */
    protected static function syncDocument(
        string $sourceType,
        int $sourceId,
        float $taxAmount,
        ?string $status,
        ?string $currency,
        float $forexRate,
        string $partyType,
        ?int $partyId,
        ?string $documentNumber,
        string $entryType,
        ?string $transactionDate = null
    ): void {
        $taxKes = round($taxAmount * $forexRate, 2);
        $inScope = self::documentInScope($status, $taxKes);

        if (! self::ledgerAvailable()) {
            return;
        }

        $netPosted = (float) TaxTransaction::query()
            ->where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->where('is_deleted', false)
            ->sum('converted_amount');

        // The desired NET is signed like the ledger: VAT_OUT documents
        // increase (+), VAT_IN documents reduce (−). Comparing the signed
        // desired value against the posted net keeps restatements on the
        // right side — mixing signs here once flipped a credit-note
        // reduction into a +640 liability increase.
        $desiredNet = $inScope
            ? ($entryType === self::ENTRY_VAT_OUT ? $taxKes : -$taxKes)
            : 0.0;

        $delta = round($desiredNet - $netPosted, 2);

        if (abs($delta) < 0.005) {
            return;
        }

        if ($inScope && abs($netPosted) < 0.005) {
            // First posting for this document.
            self::record([
                'side' => $entryType === self::ENTRY_VAT_OUT ? self::SIDE_CR : self::SIDE_DR,
                'entry_type' => $entryType,
                'direction' => $entryType === self::ENTRY_VAT_OUT ? self::DIRECTION_COLLECTED : self::DIRECTION_PAID,
                'source_type' => $sourceType,
                'source_id' => $sourceId,
                'amount' => $taxAmount,
                'transaction_currency' => $currency,
                'exchange_rate' => $forexRate,
                'transaction_date' => $transactionDate,
                'party_id' => $partyId,
                'party_type' => $partyType,
                'narration' => self::narrationFor($sourceType, $entryType, $documentNumber),
            ]);

            return;
        }

        // Restate: keep the original entry, correct the difference. The
        // correction is dated with the document so it lands inside the same
        // reporting window as what it corrects.
        self::recordBalancing($sourceType, $sourceId, $delta, $currency, 1.0, self::restateReason($inScope), $transactionDate);
    }

    /** Balancing-row narration distinguishes edits from deletions. */
    protected static function restateReason(bool $inScope): string
    {
        return $inScope
            ? 'Tax adjustment for updated document'
            : 'Tax reversal for withdrawn document';
    }

    /**
     * The ledger is optional infrastructure: minimal test schemas or
     * pre-migration databases may not have the table/chart — postings then
     * degrade to no-ops instead of breaking document workflows.
     */
    protected static function ledgerAvailable(): bool
    {
        try {
            return Schema::hasTable('tax_transactions')
                && (bool) self::taxChartId();
        } catch (Throwable) {
            return false;
        }
    }

    /** The tax payable chart id, resolved through DB (no model scopes). */
    protected static function taxChartId(): ?int
    {
        $id = DB::table('chart_of_accounts')
            ->where('code', self::CHART_TAX_PAYABLE_CODE)
            ->value('id');

        return $id ? (int) $id : null;
    }

    /**
     * Live KRA PIN read directly from the party tables (through DB to stay
     * independent of model scopes on minimal schemas).
     */
    protected static function partyKraPin(?string $partyType, ?int $partyId): ?string
    {
        if (! $partyId || ! $partyType) {
            return null;
        }

        try {
            $table = $partyType === 'company' ? 'companies' : 'customers';

            $pin = DB::table($table)
                ->where('id', $partyId)
                ->value('kra_pin');

            return $pin ? (string) $pin : null;
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * Post a VAT movement.
     *
     * @param  array{
     *     side: 'dr'|'cr', entry_type: string, direction: string,
     *     source_type: string, source_id?: int|null, amount: float|int|string,
     *     transaction_currency?: ?string, exchange_rate?: float,
     *     transaction_date?: ?string, party_id?: ?int, party_type?: ?string,
     *     kra_pin?: ?string, narration?: ?string, payment_id?: ?int,
     *     tax_id?: ?int, created_by?: ?int
     * }  $data
     */
    public static function record(array $data): ?TaxTransaction
    {
        $raw = (float) ($data['amount'] ?? 0);

        if (abs($raw) < 0.005) {
            return null;
        }

        $currency = $data['transaction_currency'] ?? null;
        $rate = (float) ($data['exchange_rate'] ?? 0);
        if ($rate <= 0) {
            $rate = 1.0;
        }
        $kes = self::toKes($raw, $currency, $rate);

        if (abs($kes) < 0.005) {
            return null;
        }

        $side = $data['side'] ?? self::SIDE_CR;
        // Debit entries reduce the liability; credit entries increase it.
        $signed = $side === self::SIDE_DR ? -$kes : $kes;

        $party = self::resolveParty($data);

        $created = null;

        try {
            DB::transaction(function () use ($data, &$created, $raw, $currency, $rate, $signed, $side, $party) {
                $chartId = self::taxChartId();

                $transactionDate = ($data['transaction_date'] ?? null) ?: now()->toDateString();

                // The running balance continues from the last posted entry.
                $last = TaxTransaction::query()
                    ->orderByDesc('id')
                    ->lockForUpdate()
                    ->first();

                $running = round((float) ($last?->running_balance ?? 0) + $signed, 2);

                $created = TaxTransaction::create([
                    'transaction_number' => (new CommonService)->generateUniqueCode('TAX-'),
                    'tax_id' => $data['tax_id'] ?? null,
                    'side' => $side,
                    'direction' => $data['direction'] ?? ($side === self::SIDE_DR ? self::DIRECTION_PAID : self::DIRECTION_COLLECTED),
                    'entry_type' => $data['entry_type'],
                    'chart_of_account' => $chartId,
                    'amount' => round($raw, 2),
                    'transaction_currency' => $currency,
                    'exchange_rate' => $rate,
                    'converted_amount' => $signed,
                    'running_balance' => $running,
                    'transaction_date' => $transactionDate,
                    'posted_date' => now()->toDateString(),
                    'customer_id' => $party['type'] === 'customer' ? $party['id'] : ($data['customer_id'] ?? null),
                    'company_id' => $party['type'] === 'company' ? $party['id'] : ($data['company_id'] ?? null),
                    'supplier_or_customer' => $party['id'],
                    'kra_pin' => self::resolveKraPin($party, $data['kra_pin'] ?? null),
                    'source_type' => $data['source_type'],
                    'source_id' => $data['source_id'] ?? null,
                    'payment_id' => $data['payment_id'] ?? null,
                    'narration' => $data['narration'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'created_by' => $data['created_by'] ?? null,
                    'updated_by' => $data['created_by'] ?? null,
                ]);
            });
        } catch (Throwable $e) {
            report($e);

            return null;
        }

        return $created;
    }

    /**
     * Post a signed 'Balancing' correction so a document's original entries
     * stay intact while the running liability reflects its restated
     * position. A positive delta increases the liability, negative reduces.
     */
    public static function recordBalancing(
        string $sourceType,
        int $sourceId,
        float $deltaKes,
        ?string $currency,
        float $forexRate,
        string $reason,
        ?string $transactionDate = null
    ): ?TaxTransaction {
        if (abs($deltaKes) < 0.005) {
            return null;
        }

        $party = self::partyOfSource($sourceType, $sourceId);

        return self::record([
            'side' => $deltaKes > 0 ? self::SIDE_CR : self::SIDE_DR,
            'entry_type' => self::ENTRY_BALANCING,
            'direction' => $deltaKes > 0 ? self::DIRECTION_COLLECTED : self::DIRECTION_PAID,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => abs($deltaKes),
            'transaction_currency' => $currency,
            'exchange_rate' => $forexRate,
            'transaction_date' => $transactionDate,
            'party_id' => $party['id'],
            'party_type' => $party['type'],
            'narration' => $reason,
        ]);
    }

    /**
     * Raw per-period declared VAT positions (no settlements mixed in),
     * keyed as YYYY-MM: output VAT, recoverable VAT and net liability per
     * calendar month — the position a monthly bill snapshots.
     *
     * @return array<string, array{vat_out: float, vat_in: float, net: float}>
     */
    public static function declaredPositionsByPeriod(): array
    {
        $periods = [];

        $raw = config('database.default') === 'sqlite'
            ? TaxTransaction::query()
                ->where('is_deleted', false)
                ->where('entry_type', '!=', self::ENTRY_BALANCING)
                ->get(['entry_type', 'converted_amount', 'transaction_date'])
            : TaxTransaction::query()
                ->where('is_deleted', false)
                ->where('entry_type', '!=', self::ENTRY_BALANCING)
                ->get(['entry_type', 'converted_amount', 'transaction_date']);

        foreach ($raw as $entry) {
            $date = (string) $entry->transaction_date;
            $period = substr($date, 0, 7);
            $amount = (float) $entry->converted_amount;

            $periods[$period] ??= ['vat_out' => 0.0, 'vat_in' => 0.0, 'net' => 0.0];

            if ($entry->entry_type === self::ENTRY_VAT_OUT) {
                $periods[$period]['vat_out'] = round($periods[$period]['vat_out'] + $amount, 2);
            } elseif ($entry->entry_type === self::ENTRY_VAT_IN) {
                $periods[$period]['vat_in'] = round($periods[$period]['vat_in'] + $amount, 2);
            }

            $periods[$period]['net'] = round($periods[$period]['net'] + $amount, 2);
        }

        ksort($periods);

        return $periods;
    }

    /**
     * The ledger listing for the UI: chronological (date, id), with the
     * running balance rolling from the opening balance (net of all entries
     * dated before the from-date) through the filtered window.
     *
     * Tax-bill remittances keep their actual payment date here — the
     * chronological audit trail. Per-period attribution (a month-1 bill
     * paid in month 3 still clearing month 1's liability) is resolved from
     * the bills themselves: TaxBillService::periodReconciliation().
     */
    public static function ledgerListing(?string $from = null, ?string $to = null): array
    {
        $query = TaxTransaction::query()->where('is_deleted', false);

        if ($from) {
            $query->whereDate('transaction_date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('transaction_date', '<=', $to);
        }

        $entries = $query->orderBy('transaction_date')->orderBy('id')->get();

        $opening = self::balanceBefore($from);

        $running = $opening;
        $rows = [];
        foreach ($entries as $row) {
            $running = round($running + (float) $row->converted_amount, 2);
            $row->running_balance = $running;
            $rows[] = $row;
        }

        return ['opening_balance' => $opening, 'entries' => $rows];
    }

    /** Net liability carried into the window: all entries before $from. */
    public static function balanceBefore(?string $from): float
    {
        if (! $from) {
            return 0.0;
        }

        if (config('database.default') === 'sqlite') {
            return round((float) TaxTransaction::query()
                ->where('is_deleted', false)
                ->where('transaction_date', '<', $from)
                ->sum('converted_amount'), 2);
        }

        return round((float) TaxTransaction::query()
            ->where('is_deleted', false)
            ->whereDate('transaction_date', '<', $from)
            ->sum('converted_amount'), 2);
    }

    /**
     * Net VAT positions for the summary cards, computed directly from the
     * ledger so report figures always agree with what it shows.
     *
     * @return array{vat_out: float, vat_in: float, net: float}
     */
    public static function vatPositions(?string $from = null, ?string $to = null): array
    {
        $query = TaxTransaction::query()->where('is_deleted', false);

        if ($from) {
            $query->whereDate('transaction_date', '>=', $from);
        }
        if ($to) {
            $query->whereDate('transaction_date', '<=', $to);
        }

        if (config('database.default') === 'sqlite') {
            $rows = $query->get(['entry_type', 'converted_amount']);
            $out = $in = 0.0;
            foreach ($rows as $row) {
                $effect = abs((float) $row->converted_amount);
                if ($row->entry_type === self::ENTRY_VAT_OUT) {
                    $out += $effect;
                } elseif ($row->entry_type === self::ENTRY_VAT_IN) {
                    $in += $effect;
                }
            }

            return ['vat_out' => round($out, 2), 'vat_in' => round($in, 2), 'net' => round($out - $in, 2)];
        }

        $sums = $query
            ->selectRaw("COALESCE(SUM(CASE WHEN entry_type = 'VAT_OUT' THEN ABS(converted_amount) ELSE 0 END), 0) AS out_kes")
            ->selectRaw("COALESCE(SUM(CASE WHEN entry_type = 'VAT_IN' THEN ABS(converted_amount) ELSE 0 END), 0) AS in_kes")
            ->selectRaw('COALESCE(SUM(converted_amount), 0) AS net_kes')
            ->first();

        return [
            'vat_out' => round((float) ($sums->out_kes ?? 0), 2),
            'vat_in' => round((float) ($sums->in_kes ?? 0), 2),
            'net' => round((float) ($sums->net_kes ?? 0), 2),
        ];
    }

    /**
     * Rebuild running balances over the whole ledger in chronological order.
     */
    public static function recalculateRunningBalances(): void
    {
        DB::transaction(function () {
            $running = 0.0;

            TaxTransaction::query()
                ->where('is_deleted', false)
                ->orderBy('transaction_date')
                ->orderBy('id')
                ->lockForUpdate()
                ->each(function (TaxTransaction $entry) use (&$running) {
                    $running = round($running + (float) $entry->converted_amount, 2);

                    if (abs((float) $entry->running_balance - $running) >= 0.005) {
                        $entry->running_balance = $running;
                        $entry->save();
                    }
                });
        });
    }

    /**
     * A document contributes a tax position once it leaves draft (and is not
     * cancelled/deleted) with a non-zero tax amount.
     */
    protected static function documentInScope(?string $status, float $taxKes): bool
    {
        return $taxKes >= 0.005
            && ! in_array($status, ['draft', 'cancelled'], true);
    }

    protected static function narrationFor(
        string $sourceType,
        string $entryType,
        ?string $documentNumber
    ): string {
        $label = $documentNumber ?: ('#');
        $doc = str_replace('_', ' ', $sourceType).' '.$label;

        return $entryType === self::ENTRY_VAT_OUT
            ? 'Output VAT on '.$doc
            : 'Recoverable VAT from '.$doc;
    }

    /** Invoices freeze their forex rate; KES keeps 1. */
    protected static function invoiceForexRate(CustInvoice $invoice): float
    {
        $rate = (float) ($invoice->forex_rate ?? 0);

        return $rate > 0 ? $rate : 1.0;
    }

    /** Convert a document-currency amount to KES at the given rate. */
    protected static function toKes(float $amount, ?string $currency, float $rate): float
    {
        if (! $currency || $currency === 'KES' || $rate <= 0) {
            return $amount;
        }

        return $amount * $rate;
    }

    /**
     * @return array{type:?string, id:?int}
     */
    protected static function resolveParty(array $data): array
    {
        $partyId = $data['party_id'] ?? null;
        $partyType = $data['party_type'] ?? null;

        if (! $partyId) {
            $sourceType = $data['source_type'] ?? null;
            $sourceId = $data['source_id'] ?? null;

            if ($sourceType && $sourceId) {
                $party = self::partyOfSource($sourceType, (int) $sourceId);
                $partyId = $party['id'];
                $partyType = $party['type'];
            }
        }

        if (! $partyId) {
            return ['type' => null, 'id' => null];
        }

        if (! $partyType) {
            // Caller knows the id but not the side: infer from column use.
            if (($data['company_id'] ?? null) !== null) {
                $partyType = 'company';
            } else {
                $partyType = 'customer';
            }
        }

        return ['type' => $partyType, 'id' => (int) $partyId];
    }

    /**
     * Party for a ledger row already written, resolved from the source
     * document when the caller hasn't supplied it.
     *
     * @return array{type:?string, id:?int}
     */
    protected static function partyOfSource(string $sourceType, int $sourceId): array
    {
        try {
            $document = match ($sourceType) {
                'cust_invoice' => CustInvoice::withDeleted()->find($sourceId),
                'customer_debit_note' => CustDebitNote::withDeleted()->with('invoice')->find($sourceId),
                'cust_credit_note' => CustCreditNote::withDeleted()->with('invoice')->find($sourceId),
                'company_invoice' => CompanyInvoice::withDeleted()->find($sourceId),
                'company_credit_note' => CompanyCreditNote::withDeleted()->with('invoice')->find($sourceId),
                // Payment-driven sources and minimal schemas resolve without
                // a party: the entry keeps no attributable party.
                default => null,
            };

            if (! $document) {
                return ['type' => null, 'id' => null];
            }
        } catch (Throwable) {
            return ['type' => null, 'id' => null];
        }

        $partyId = null;
        $partyType = null;

        try {
            if ($document instanceof CustInvoice) {
                $partyId = $document->customer_id;
                $partyType = 'customer';
            } elseif ($document instanceof CustDebitNote || $document instanceof CustCreditNote) {
                $partyId = $document->invoice?->customer_id;
                $partyType = 'customer';
            } elseif ($document instanceof CompanyInvoice) {
                $partyId = $document->company_id;
                $partyType = 'company';
            } elseif ($document instanceof CompanyCreditNote) {
                // The note table carries no company_id; reach it via the invoice.
                $partyId = $document->invoice?->company_id;
                $partyType = 'company';
            }
        } catch (Throwable) {
            $partyId = null;
            $partyType = null;
        }

        return ['type' => $partyType, 'id' => $partyId ? (int) $partyId : null];
    }

    /**
     * @param  array{type:?string, id:?int}  $party
     */
    protected static function resolveKraPin(array $party, ?string $known = null): ?string
    {
        return self::partyKraPin($party['type'], $party['id']) ?: $known ?: null;
    }
}
