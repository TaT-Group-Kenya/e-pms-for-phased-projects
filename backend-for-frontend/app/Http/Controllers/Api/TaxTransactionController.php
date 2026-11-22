<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaxTransactionResource;
use App\Models\TaxTransaction;
use App\Services\TaxTransactionService;
use Illuminate\Http\Request;

class TaxTransactionController extends Controller
{
    /**
     * The VAT ledger report: every entry in the date window, in
     * chronological order, with the running liability balance. No
     * pagination — reports must total over the whole window.
     */
    public function index(Request $request)
    {
        $from = $request->get('from');
        $to = $request->get('to');

        $listing = TaxTransactionService::ledgerListing($from, $to);

        $entries = $listing['entries'];

        if ($request->filled('supplier_or_customer')) {
            $party = (int) $request->get('supplier_or_customer');
            $entries = array_values(array_filter(
                $entries,
                fn ($row) => (int) $row->supplier_or_customer === $party
            ));
        }

        $vatIn = TaxTransactionService::vatPositions($from, $to);

        // Exclusive amounts (net before VAT) per entry, converted to KES at
        // the same forex rate recorded on the ledger entry (the rate applied
        // to the VAT) — the CR/DR columns carry the VAT only.
        $rows = collect($entries)->map(function (TaxTransaction $entry) {
            $resource = (new TaxTransactionResource(
                $entry->setRelation('chartOfAccount', null)
            ))->toArray(request());

            $document = $entry->sourceDocument();
            $vat = abs((float) $entry->converted_amount);
            $rate = (float) $entry->exchange_rate;

            $isTaxBillSettlement = $entry->source_type === 'tax_bill';

            if ($entry->entry_type === TaxTransactionService::ENTRY_BALANCING || $isTaxBillSettlement || ! $document) {
                // Corrections and remittances adjust the VAT only — there is
                // no document net behind them (the bill's liability is not
                // a commercial amount), so the exclusive stays empty.
                $exclusive = 0.0;
            } else {
                $exclusiveDocument = max(
                    (float) $document['total_amount'] - (float) $document['tax_amount'],
                    0
                );
                // Apply the entry's own rate: KES rows pass through at 1,
                // foreign rows convert exactly like their VAT did.
                $exclusive = $document['currency'] === 'KES'
                    ? $exclusiveDocument
                    : round($exclusiveDocument * ($rate > 0 ? $rate : 1), 2);
            }

            $resource['amount_exclusive'] = $exclusive;
            // Column placement follows the entry's side: balancing entries
            // are side-signed so their correction lands in the right column.
            $resource['vat_in_dr'] = $entry->side === TaxTransactionService::SIDE_DR ? $vat : null;
            $resource['vat_out_cr'] = $entry->side === TaxTransactionService::SIDE_CR ? $vat : null;
            // Tax bill settlements name the funding account; other documents
            // fall back to their type label.
            $resource['particulars'] = $document['particulars']
                ?? ($document
                    ? str_replace('_', ' ', ucfirst((string) $document['type']))
                    : ($entry->entry_type === TaxTransactionService::ENTRY_BALANCING ? 'Balancing entry' : 'Ledger entry'));

            return $resource;
        });

        $totalVatIn = round($rows->sum(fn ($row) => (float) ($row['vat_in_dr'] ?? 0)), 2);
        $totalVatOut = round($rows->sum(fn ($row) => (float) ($row['vat_out_cr'] ?? 0)), 2);

        return response()->json([
            'data' => $rows,
            'meta' => [
                'total' => count($rows),
            ],
            'totals' => [
                'amount_exclusive' => round($rows->sum(fn ($row) => (float) $row['amount_exclusive']), 2),
                'vat_in_dr' => $totalVatIn,
                'vat_out_cr' => $totalVatOut,
                // Liability: CR (output VAT) minus DR (input VAT).
                'vat_liability' => round($totalVatOut - $totalVatIn, 2),
            ],
            'opening_balance' => $listing['opening_balance'],
        ]);
    }

    public function show(TaxTransaction $taxTransaction)
    {
        return (new TaxTransactionResource(
            $taxTransaction->loadMissing(['chartOfAccount', 'tax'])
        ))->additional([
            'source_document' => $taxTransaction->sourceDocument(),
        ]);
    }

    /**
     * Position summary cards: output VAT declared, input VAT recoverable and
     * the resulting net position, computed straight from the ledger.
     */
    public function summary(Request $request)
    {
        $from = $request->get('from');
        $to = $request->get('to');

        $positions = TaxTransactionService::vatPositions($from, $to);

        $currentBalance = 0.0;
        if ($to) {
            // Running balance as at the window end.
            $listing = TaxTransactionService::ledgerListing(to: $to);
            $entries = $listing['entries'];
            $currentBalance = count($entries) ? (float) end($entries)->running_balance : 0.0;
        } else {
            $currentBalance = (float) TaxTransaction::query()
                ->where('is_deleted', false)
                ->orderByDesc('id')
                ->value('running_balance');
        }

        return response()->json([
            'data' => [
                [
                    'label' => 'vat_out',
                    'title' => 'Output VAT declared',
                    'total' => $positions['vat_out'],
                ],
                [
                    'label' => 'vat_in',
                    'title' => 'Input VAT recoverable',
                    'total' => $positions['vat_in'],
                ],
                [
                    'label' => 'net_position',
                    'title' => 'Net VAT position',
                    'total' => $positions['net'],
                ],
                [
                    'label' => 'current_balance',
                    'title' => 'Current tax liability',
                    'total' => $currentBalance,
                ],
            ],
        ]);
    }
}
