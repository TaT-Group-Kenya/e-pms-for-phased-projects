<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrialBalanceRunLineResource;
use App\Http\Resources\TrialBalanceRunResource;
use App\Models\SysConfig;
use App\Models\TrialBalanceRun;
use App\Services\TrialBalanceService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class TrialBalanceController extends Controller
{
    protected TrialBalanceService $service;

    public function __construct(TrialBalanceService $service)
    {
        $this->service = $service;
    }

    /**
     * List of runs (snapshots) with date-range filtering, paginated.
     */
    public function index(Request $request)
    {
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));

        $query = TrialBalanceRun::query();

        if ($request->filled('from') && $request->filled('to')) {
            $query->whereBetween('as_at_date', [$request->get('from'), $request->get('to')]);
        } elseif ($request->filled('from')) {
            $query->whereDate('as_at_date', '>=', $request->get('from'));
        } elseif ($request->filled('to')) {
            $query->whereDate('as_at_date', '<=', $request->get('to'));
        }

        $data = $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);

        return TrialBalanceRunResource::collection($data);
    }

    /**
     * Generate a new snapshot. Creates a NEW run each time (history).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'as_at_date' => ['required', 'date'],
            'forex_rate' => ['required', 'numeric', 'min:0.000001'],
        ]);

        try {
            $run = $this->service->generate([
                'as_at_date' => $validated['as_at_date'],
                'forex_rate' => $validated['forex_rate'],
                'created_by' => Auth::id(),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Trial balance generated.',
            'data' => new TrialBalanceRunResource($run),
        ], 201);
    }

    /**
     * Detail view: run metadata + chart-level lines + totals.
     */
    public function show(Request $request, TrialBalanceRun $trial_balance_run)
    {
        $presented = $this->service->present($trial_balance_run);

        return response()->json(['data' => $presented]);
    }

    /**
     * Detail rows (drill-down) for a run, paginated.
     */
    public function lines(Request $request, TrialBalanceRun $trial_balance_run)
    {
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));

        $query = $trial_balance_run->lines()
            ->join('chart_of_accounts as c', 'c.id', '=', 'trial_balance_run_lines.chart_of_account')
            ->select('trial_balance_run_lines.*', 'c.code AS chart_code', 'c.name AS chart_name')
            ->orderBy('chart_code')
            ->orderBy('source_table')
            ->orderBy('source_id');

        $data = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($data->items())->map(fn ($row) => [
                'id' => $row->id,
                'chart_code' => $row->chart_code,
                'chart_name' => $row->chart_name,
                'category' => $row->category,
                'source_table' => $row->source_table,
                'source_type' => $row->source_type,
                'source_id' => $row->source_id,
                'account_id' => $row->account_id,
                'debit_kes' => (float) $row->debit_kes,
                'credit_kes' => (float) $row->credit_kes,
                'debit_usd' => (float) $row->debit_usd,
                'credit_usd' => (float) $row->credit_usd,
                'description' => $row->description,
            ]),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
        ]);
    }

    /**
     * Soft-delete a run (logical deletion; the snapshot's lines remain in
     * the database for audit history).
     */
    public function destroy(Request $request, TrialBalanceRun $trial_balance_run)
    {
        $trial_balance_run->softDelete((int) Auth::id());

        return response()->noContent();
    }

    public function exportCsv(Request $request, TrialBalanceRun $trial_balance_run): StreamedResponse
    {
        $lines = $this->chartLines($trial_balance_run);

        return response()->streamDownload(function () use ($lines) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['Type', 'Account', 'Debit (KES)', 'Credit (KES)'], escape: '\\');
            foreach ($lines as $line) {
                fputcsv($out, [
                    $line->category,
                    $line->account_name,
                    $line->debit_kes,
                    $line->credit_kes,
                ], escape: '\\');
            }
            fputcsv($out, ['TOTAL',
                $lines->sum('debit_kes'), $lines->sum('credit_kes'),
            ], escape: '\\');
            fclose($out);
        }, $trial_balance_run->run_number.'-trial-balance.csv', ['Content-Type' => 'text/csv']);
    }

    public function exportPdf(Request $request, TrialBalanceRun $trial_balance_run)
    {
        $configValues = SysConfig::whereIn('name', ['NAME'])->pluck('value', 'name');

        // Named accounts live on the run lines (description column) — one
        // row per layout line: Type / Code / Account / Debit / Credit.
        $lines = $trial_balance_run->lines()
            ->join('chart_of_accounts as c', 'c.id', '=', 'trial_balance_run_lines.chart_of_account')
            ->selectRaw('
                trial_balance_run_lines.id,
                c.code AS chart_code,
                trial_balance_run_lines.category,
                trial_balance_run_lines.description AS account_name,
                SUM(debit_kes) AS debit_kes,
                SUM(credit_kes) AS credit_kes
            ')
            ->groupBy('trial_balance_run_lines.id', 'c.code', 'trial_balance_run_lines.category', 'account_name')
            ->orderBy('c.code')
            ->orderBy('account_name')
            ->get();

        $totals = [
            'debit_kes' => (float) $lines->sum('debit_kes'),
            'credit_kes' => (float) $lines->sum('credit_kes'),
        ];

        $html = view('pdf.trial-balance', [
            'run' => $trial_balance_run,
            'lines' => $lines,
            'totals' => $totals,
            'senderName' => $configValues['NAME'] ?? config('app.name', 'EPMS'),
        ])->render();

        $options = new Options;
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        // Landscape: the trial balance reads across the page.
        $dompdf->setPaper('A4', 'landscape');
        $dompdf->render();

        $fileName = $trial_balance_run->run_number.'-trial-balance.pdf';

        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, $fileName, ['Content-Type' => 'application/pdf']);
    }

    /**
     * One row per trial-balance layout line (Type / Code / Account /
     * Debit / Credit) for the CSV and PDF exports. Each line already
     * stores its own named account in `description`.
     */
    protected function chartLines(TrialBalanceRun $run)
    {
        return $run->lines()
            ->join('chart_of_accounts as c', 'c.id', '=', 'trial_balance_run_lines.chart_of_account')
            ->selectRaw('
                trial_balance_run_lines.id,
                trial_balance_run_lines.category,
                trial_balance_run_lines.description AS account_name,
                SUM(debit_kes) AS debit_kes,
                SUM(credit_kes) AS credit_kes
            ')
            ->groupBy('trial_balance_run_lines.id', 'trial_balance_run_lines.category', 'account_name')
            ->orderBy('trial_balance_run_lines.id')
            ->get();
    }
}
