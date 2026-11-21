<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\EnsuresOpenPeriod;
use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Models\SysConfig;
use App\Models\TaxBill;
use App\Models\TaxTransaction;
use App\Services\TaxBillService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class TaxBillController extends Controller
{
    use EnsuresOpenPeriod;

    protected TaxBillService $service;

    public function __construct(TaxBillService $service)
    {
        $this->service = $service;
    }

    /**
     * The bills table: monthly VAT runs with amount, paid and balance.
     */
    public function index(Request $request)
    {
        $perPage = (int) ($request->get('per_page', 100));
        $page = (int) ($request->get('page', 1));

        $data = $this->service->index($request->only(['from', 'to', 'status']), $perPage, $page);

        // The rows for the report shape, including per-bill line details.
        $rows = collect($data->items())->map(fn (TaxBill $bill) => $this->billResource($bill));

        // Latest run per month (for the "already run" UI state).
        $currentBalance = round((float) TaxTransaction::query()
            ->where('is_deleted', false)
            ->orderByDesc('id')
            ->value('running_balance'), 2);

        return response()->json([
            'data' => $rows,
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
            'position' => [
                'current_balance' => $currentBalance,
                'all_periods_settled' => TaxBillService::allPeriodsSettled(),
            ],
        ]);
    }

    /**
     * Per-period reconciliation: what each billed month declared, what its
     * own settlement covered (even when the payment posts in a later month,
     * after further ledger entries), and what is still outstanding.
     */
    public function reconciliation(Request $request)
    {
        $rows = TaxBillService::periodReconciliation(
            $request->get('from'),
            $request->get('to')
        );

        return response()->json([
            'data' => $rows,
            'totals' => [
                'declared' => round(array_sum(array_column($rows, 'declared')), 2),
                'settled_for_period' => round(array_sum(array_column($rows, 'settled_for_period')), 2),
                'carried_forward' => round(array_sum(array_column($rows, 'carried_forward')), 2),
                'outstanding' => round(array_sum(array_column($rows, 'outstanding')), 2),
            ],
        ]);
    }

    public function show(Request $request, int $id)
    {
        $bill = $this->service->find($id);

        return response()->json([
            'data' => $this->billResource($bill),
        ]);
    }

    /**
     * Run a monthly VAT bill. A month can only be billed once.
     */
    public function run(Request $request)
    {
        $validated = $request->validate([
            'period_year' => ['required', 'integer', 'min:2000', 'max:2100'],
            'period_month' => ['required', 'integer', 'min:1', 'max:12'],
        ]);

        $bill = $this->service->runMonth(
            (int) $validated['period_year'],
            (int) $validated['period_month'],
            Auth::id()
        );

        return response()->json([
            'message' => 'Tax bill '.$bill->bill_number.' generated for '.$bill->label().'.',
            'data' => $this->billResource($bill),
        ], 201);
    }

    /**
     * Pay a bill in one installment from a selected account.
     */
    public function pay(Request $request, int $id)
    {
        $bill = $this->service->find($id);

        // The payment posts on payment_date: that month must be open.
        if ($response = $this->ensurePeriodOpenForDate($request->get('payment_date'), 'payment_date')) {
            return $response;
        }

        try {
            $paid = $this->service->payFromAccount($bill, $request->all(), Auth::id());
        } catch (ValidationException $e) {
            return response()->json([
                'message' => collect($e->errors())->flatten()->first() ?? 'Payment failed.',
                'errors' => $e->errors(),
            ], 422);
        }

        return response()->json([
            'message' => 'Tax bill '.$bill->bill_number.' paid from the selected account.',
            'data' => $this->billResource($paid),
        ]);
    }

    /**
     * Export a tax bill as PDF (bill header, settlement summary and the
     * per-document VAT breakdown for the month).
     */
    public function exportPdf(Request $request, int $id)
    {
        $bill = $this->service->find($id);
        $pdf = $this->buildTaxBillPdf($bill, $request->user()?->id);

        return response($pdf['output'], 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$pdf['fileName'].'"',
        ]);
    }

    /**
     * The bill row in the report shape.
     */
    protected function billResource(TaxBill $bill): array
    {
        return [
            'id' => $bill->id,
            'bill_number' => $bill->bill_number,
            'date' => $bill->created_at ? $bill->created_at->toDateString() : null,
            'period_month' => $bill->period_month,
            'period_year' => $bill->period_year,
            'period' => $bill->periodIdentifier(),
            'particulars' => $bill->label(),
            'name' => 'Tax Agency (Sales Tax)',
            'amount' => (float) $bill->amount,
            'paid' => (float) $bill->paid_amount,
            'balance' => (float) $bill->balance,
            'status' => $bill->status,
            'run_date' => $bill->run_date?->toDateString(),
            'paid_date' => $bill->paid_date?->toDateString(),
            'vat_out' => (float) $bill->vat_out,
            'vat_in' => (float) $bill->vat_in,
            'vat_liability' => (float) $bill->vat_liability,
            'settled_for_period' => (float) $bill->settled_for_period,
            'carried_forward' => (float) $bill->carried_forward,
            'paid_from_account' => $bill->paid_from_account,
            'transaction' => $bill->transaction ? [
                'id' => $bill->transaction->id,
                'transaction_number' => $bill->transaction->transaction_number,
                'transaction_date' => $bill->transaction->transaction_date,
                'amount' => (float) $bill->transaction->amount,
            ] : null,
            'tax_ledger_entry' => $bill->taxLedgerEntry ? [
                'id' => $bill->taxLedgerEntry->id,
                'transaction_number' => $bill->taxLedgerEntry->transaction_number,
                'running_balance' => $bill->taxLedgerEntry->running_balance !== null
                    ? (float) $bill->taxLedgerEntry->running_balance : null,
            ] : null,
        ];
    }

    protected function buildTaxBillPdf(TaxBill $bill, ?int $userId): array
    {
        $configValues = SysConfig::whereIn('name', [
            'NAME', 'EMAIL', 'INSTANCE_LOGO', 'ADDRESS_LINE_1',
            'CITY', 'STATE', 'COUNTRY', 'PHONE', 'WEBSITE',
        ])->pluck('value', 'name');

        $fundingAccount = $bill->paid_from_account
            ? DB::table('accounts')->where('id', (int) $bill->paid_from_account)->value('name')
            : null;

        $html = view('pdf.tax-bill', [
            'bill' => $bill,
            'senderName' => $configValues['NAME'] ?? config('app.name', 'EPMS'),
            'senderEmail' => $configValues['EMAIL'] ?? null,
            'senderPhone' => $configValues['PHONE'] ?? null,
            'senderAddress' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity' => $configValues['CITY'] ?? null,
            'senderCountry' => $configValues['COUNTRY'] ?? null,
            'senderWebsite' => $configValues['WEBSITE'] ?? null,
            'instanceLogo' => $configValues['INSTANCE_LOGO'] ?? null,
            'fundingAccount' => $fundingAccount,
        ])->render();

        $options = new Options;
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();
        $fileName = $bill->bill_number.'.pdf';
        $relativePath = 'tax-bills/'.$fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $bill->bill_number]);
        $download->path = $relativePath;
        $download->updated_at = now();
        $download->updated_by = $userId;
        if (! $download->exists) {
            $download->created_at = now();
            $download->created_by = $userId;
        }
        $download->save();

        return [
            'fileName' => $fileName,
            'relativePath' => $relativePath,
            'output' => $output,
        ];
    }
}
