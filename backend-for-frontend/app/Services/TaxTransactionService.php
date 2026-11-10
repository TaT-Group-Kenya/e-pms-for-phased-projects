<?php

namespace App\Services;

use App\Models\ChartOfAccount;
use App\Models\TaxTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Tax sub-ledger with a DR/CR setup per source document:
 *
 *  - DR, at document creation: the full tax liability (or recoverable) is
 *    opened at the document's own forex rate.
 *  - CR, as the document is settled: collected (customer side) or realized
 *    (company side) tax, at the payment's recorded rate.
 *  - adjusted: credit notes / corrections that reduce the document's tax.
 *
 * Derived per document: uncollected = DR − CR. The trial balance splits the
 * total into "Tax Payable (collected)" and "Tax Payable (uncollected)"
 * rows for customer-side documents, and mirrored "Tax Recoverable" rows for
 * company-side documents.
 */
class TaxTransactionService
{
    public const CHART_TAX_COLLECTED_CODE = '2000';

    public const CHART_TAX_PAID_CODE = '1000';

    public const DIRECTION_COLLECTED = 'collected';

    public const DIRECTION_PAID = 'paid';

    public const DIRECTION_ADJUSTED = 'adjusted';

    public const SIDE_DR = 'dr';

    public const SIDE_CR = 'cr';

    /**
     * Log a tax movement against a document.
     *
     * @param  array{side?: 'dr'|'cr', direction?: 'collected'|'paid'|'adjusted', tax_id?: int|null,
     *                source_type: string, source_id?: int|null, amount: float|int|string,
     *                transaction_currency?: ?string, exchange_rate?: float,
     *                transaction_date?: string, posted_date?: ?string,
     *                customer_id?: ?int, company_id?: ?int, payment_id?: ?int,
     *                narration?: ?string, chart_of_account?: ?int, created_by?: ?int}  $data
     */
    public static function record(array $data): ?TaxTransaction
    {
        $amount = round((float) ($data['amount'] ?? 0), 2);

        if ($amount <= 0) {
            return null;
        }

        try {
            $defaultChart = ChartOfAccount::where(
                'code',
                ($data['direction'] ?? self::DIRECTION_COLLECTED) === self::DIRECTION_PAID
                    ? self::CHART_TAX_PAID_CODE
                    : self::CHART_TAX_COLLECTED_CODE
            )->value('id');
        } catch (\Throwable $e) {
            Log::warning('tax chart lookup failed', ['e' => $e->getMessage()]);

            return null;
        }

        $transactionDate = $data['transaction_date'] ?? now()->toDateString();

        return DB::transaction(function () use ($data, $amount, $defaultChart, $transactionDate) {
            $commonService = new CommonService;

            return TaxTransaction::create([
                'transaction_number' => $commonService->generateUniqueCode('TAX-'),
                'tax_id' => $data['tax_id'] ?? null,
                'side' => $data['side'] ?? self::SIDE_CR,
                'direction' => $data['direction'] ?? self::DIRECTION_COLLECTED,
                'chart_of_account' => $data['chart_of_account'] ?? $defaultChart,
                'amount' => $amount,
                'transaction_currency' => $data['transaction_currency'] ?? null,
                'exchange_rate' => $data['exchange_rate'] ?? 1,
                'converted_amount' => round($amount * ($data['exchange_rate'] ?? 1), 2),
                'transaction_date' => $transactionDate,
                'posted_date' => $data['posted_date'] ?? now()->toDateString(),
                'customer_id' => $data['customer_id'] ?? null,
                'company_id' => $data['company_id'] ?? null,
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
    }

    /**
     * Open a document's full tax position (DR) at its stored forex rate.
     * Idempotent: skips when the document already has a DR row.
     */
    public static function openDocumentTax(
        string $sourceType,
        int $sourceId,
        float $taxAmount,
        ?string $currency,
        ?float $forexRate,
        ?int $createdBy = null,
        ?string $narration = null,
        string $direction = self::DIRECTION_COLLECTED
    ): ?TaxTransaction {
        if (round($taxAmount, 2) <= 0) {
            return null;
        }

        $exists = TaxTransaction::where('source_type', $sourceType)
            ->where('source_id', $sourceId)
            ->where('side', self::SIDE_DR)
            ->where('is_deleted', false)
            ->exists();

        if ($exists) {
            return null;
        }

        return self::record([
            'side' => self::SIDE_DR,
            'direction' => $direction,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'amount' => $taxAmount,
            'transaction_currency' => $currency,
            'exchange_rate' => $forexRate ?? 1,
            'transaction_date' => now()->toDateString(),
            'narration' => $narration ?? ('Full tax opened on '.$sourceType.' #'.$sourceId),
            'created_by' => $createdBy,
        ]);
    }

    /**
     * Per-document-type tax buckets for the trial balance, as at a date:
     * tax_opened (DR), tax_collected (CR), tax_uncollected = opened − collected.
     */
    public static function documentBuckets(string $asAt): array
    {
        $dr = DB::table('tax_transactions')
            ->where('is_deleted', false)
            ->whereDate('transaction_date', '<=', $asAt)
            ->where('side', self::SIDE_DR)
            ->selectRaw('source_type, chart_of_account, SUM(converted_amount) AS total, COUNT(DISTINCT source_id) AS documents')
            ->groupBy('source_type', 'chart_of_account')
            ->get();

        $cr = DB::table('tax_transactions')
            ->where('is_deleted', false)
            ->whereDate('transaction_date', '<=', $asAt)
            ->where('side', self::SIDE_CR)
            ->selectRaw('source_type, chart_of_account, SUM(converted_amount) AS total, COUNT(DISTINCT source_id) AS documents')
            ->groupBy('source_type', 'chart_of_account')
            ->get()
            ->keyBy(function ($row) {
                return $row->source_type.'|'.$row->chart_of_account;
            });

        $buckets = [];
        foreach ($dr as $row) {
            $key = $row->source_type.'|'.$row->chart_of_account;
            $buckets[$key] = [
                'source_type' => $row->source_type,
                'chart_of_account' => (int) $row->chart_of_account,
                'tax_opened' => (float) $row->total,
                'tax_collected' => (float) ($cr[$key]->total ?? 0),
                'documents' => (int) $row->documents,
                'tax_uncollected' => round((float) $row->total - (float) ($cr[$key]->total ?? 0), 2),
            ];
        }

        return $buckets;
    }
}
