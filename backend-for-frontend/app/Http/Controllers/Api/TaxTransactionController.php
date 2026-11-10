<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaxTransactionResource;
use App\Models\TaxTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TaxTransactionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));

        $query = TaxTransaction::query()->with(['chartOfAccount', 'tax']);

        if ($request->filled('direction')) {
            $query->where('direction', $request->get('direction'));
        }

        if ($request->filled('chart_of_account')) {
            $query->where('chart_of_account', $request->get('chart_of_account'));
        }

        if ($request->filled('source_type')) {
            $query->where('source_type', $request->get('source_type'));
        }

        $data = $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);

        return TaxTransactionResource::collection($data);
    }

    public function show(TaxTransaction $taxTransaction)
    {
        return new TaxTransactionResource(
            $taxTransaction->loadMissing(['chartOfAccount', 'tax'])
        );
    }

    public function summary(Request $request)
    {
        $query = TaxTransaction::query()->where('is_deleted', false);

        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('transaction_date', [$request->get('from'), $request->get('to')]);
        }

        $rows = (clone $query)
            ->selectRaw('side, direction, chart_of_account, SUM(converted_amount) AS total, COUNT(*) AS entries')
            ->groupBy('side', 'direction', 'chart_of_account')
            ->with('chartOfAccount')
            ->get()
            ->map(function ($row) {
                // DR rows are "opened" positions (full tax booked at document
                // creation), not collections — grouped separately so they are
                // never summed together with actual collections.
                $label = $row->side === \App\Services\TaxTransactionService::SIDE_DR
                    ? 'opened'
                    : $row->direction;

                return [
                    'label' => $label,
                    'side' => $row->side,
                    'direction' => $row->direction,
                    'chart_of_account' => $row->chart_of_account,
                    'chart' => $row->chartOfAccount ? [
                        'id' => $row->chartOfAccount->id,
                        'code' => $row->chartOfAccount->code,
                        'name' => $row->chartOfAccount->name,
                    ] : null,
                    'total' => (float) $row->total,
                    'entries' => (int) $row->entries,
                ];
            });

        // Position summary: the derived net per document bucket.
        $positions = \App\Services\TaxTransactionService::documentBuckets($request->get('to', now()->toDateString()));

        $positionRows = [
            [
                'label' => 'collected',
                'direction' => 'collected',
                'chart_of_account' => null,
                'chart' => ['id' => null, 'code' => '2000', 'name' => 'Liabilities'],
                'total' => array_sum(array_column(array_filter($positions, fn ($p) => in_array($p['source_type'], ['cust_invoice', 'customer_debit_note'])), 'tax_collected')),
                'entries' => count($positions),
            ],
            [
                'label' => 'uncollected',
                'direction' => 'collected',
                'chart_of_account' => null,
                'chart' => ['id' => null, 'code' => '2000', 'name' => 'Liabilities'],
                'total' => array_sum(array_column(array_filter($positions, fn ($p) => in_array($p['source_type'], ['cust_invoice', 'customer_debit_note'])), 'tax_uncollected')),
                'entries' => count($positions),
            ],
            [
                'label' => 'paid',
                'direction' => 'paid',
                'chart_of_account' => null,
                'chart' => ['id' => null, 'code' => '1000', 'name' => 'Assets'],
                'total' => array_sum(array_column(array_filter($positions, fn ($p) => $p['source_type'] === 'company_invoice'), 'tax_collected')),
                'entries' => count($positions),
            ],
        ];

        return response()->json(['data' => $positionRows]);
    }
}
