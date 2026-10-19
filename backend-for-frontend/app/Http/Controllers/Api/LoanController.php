<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoanStoreRequest;
use App\Http\Resources\LoanResource;
use App\Models\Account;
use App\Models\Download;
use App\Models\Loan;
use App\Models\SysConfig;
use App\Services\LoanService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LoanController extends Controller
{
    protected $service;

    public function __construct(LoanService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Account::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));

        $query = Loan::query()->with(['account', 'repayments', 'schedule']);

        if ($request->filled('account_id')) {
            $query->where('account_id', $request->get('account_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $data = $query->orderByDesc('id')->paginate($perPage, ['*'], 'page', $page);

        return LoanResource::collection($data);
    }

    public function store(LoanStoreRequest $request)
    {
        $this->authorize('create', Account::class);

        $validated = $request->validated();
        $validated['interest_rate'] = $validated['interest_type'] === 'none'
            ? 0
            : (float) ($validated['interest_rate'] ?? 0);

        $loan = $this->service->createLoan($validated, (int) Auth::id());

        return response()->json([
            'message' => 'Loan created successfully.',
            'data' => new LoanResource($loan->loadMissing(['account', 'repayments', 'schedule'])),
        ], 201);
    }

    public function show(Loan $loan)
    {
        // Loans are managed within the Accounts permission set.
        $this->authorize('view', $loan->account);

        return new LoanResource($loan->loadMissing(['account', 'repayments.paidFromAccount', 'schedule']));
    }

    public function repay(Request $request, Loan $loan, LoanService $loanService)
    {
        // Loans are managed within the Accounts permission set.
        $this->authorize('update', $loan->account);

        $data = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'paid_from_account_id' => ['required', 'integer', 'exists:accounts,id'],
            'payment_date' => ['nullable', 'date'],
            'schedule_installment_id' => ['nullable', 'integer', 'exists:loan_schedules,id'],
            'payment_reference' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            $loanService->repay($loan, $data, (int) Auth::id());
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return new LoanResource($loan->fresh(['account', 'repayments.paidFromAccount', 'schedule']));
    }

    public function statementPdf(Request $request, Loan $loan, LoanService $loanService)
    {
        $this->authorize('view', $loan->account);

        $loan->loadMissing(['account', 'repayments.paidFromAccount', 'schedule']);

        $pdf = $this->buildLoanStatementPdf(
            $loan,
            $loanService->summary($loan),
            $request->user()?->id
        );

        return response()->streamDownload(
            function () use ($pdf) {
                echo $pdf['output'];
            },
            $pdf['fileName'],
            [
                'Content-Type' => 'application/pdf',
            ]
        );
    }

    /**
     * Build the loan statement PDF, persist it and track in downloads.
     * Follows the same Dompdf pattern used by the ReportingController.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildLoanStatementPdf(Loan $loan, array $summary, ?int $userId = null): array
    {
        $configValues = SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'INSTANCE_LOGO',
            'ADDRESS_LINE_1',
            'CITY',
            'STATE',
            'COUNTRY',
            'PHONE',
            'WEBSITE',
        ])->pluck('value', 'name');

        $data = [
            'loan' => $loan,
            'summary' => $summary,
            'senderName' => $configValues['NAME'] ?? config('app.name', 'EPMS'),
            'senderEmail' => $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com'),
            'instanceLogo' => $configValues['INSTANCE_LOGO'] ?? null,
            'senderPhone' => $configValues['PHONE'] ?? null,
            'senderWebsite' => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1' => $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity' => $configValues['CITY'] ?? null,
            'senderState' => $configValues['STATE'] ?? null,
            'senderCountry' => $configValues['COUNTRY'] ?? null,
            'generatedAt' => now(),
        ];

        $html = view('pdf.loan-statement', $data)->render();

        $options = new Options;
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = 'LOAN-'.$loan->id.'-'.($loan->lender_name ?: 'statement').'.pdf';
        $fileName = preg_replace('/[^A-Za-z0-9\.\-]/', '_', $fileName);
        $relativePath = 'loan-statements/'.$fileName;

        Storage::disk('public')->put($relativePath, $output);

        $downloadKey = 'loan-statement:'.$loan->id;
        $download = Download::firstOrNew(['name' => $downloadKey]);
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