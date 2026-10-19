<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustDebitNoteStoreRequest;
use App\Http\Requests\CustDebitNoteUpdateRequest;
use App\Http\Resources\CustDebitNoteResource;
use App\Models\CustDebitNote;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CustDebitNoteService;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class CustDebitNoteController extends Controller
{
    public function __construct(private CustDebitNoteService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', CustDebitNote::class);
        $data = $this->service->index(
            $request->except('per_page', 'page'),
            max(1, (int) $request->get('per_page', 15)),
            max(1, (int) $request->get('page', 1)),
            ['invoice.customer', 'invoice.project']
        );

        return CustDebitNoteResource::collection($data);
    }

    public function store(CustDebitNoteStoreRequest $request)
    {
        $this->authorize('create', CustDebitNote::class);
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['description'] ??= $data['title'];
        $model = $this->service->create($data);

        return (new CustDebitNoteResource($model->load(['invoice.customer', 'invoice.project', 'items', 'documents'])))
            ->additional(['message' => 'Draft debit note created.']);
    }

    public function show(CustDebitNote $custDebitNote)
    {
        $this->authorize('view', $custDebitNote);

        return new CustDebitNoteResource($custDebitNote->load(['invoice.customer', 'invoice.project', 'items', 'documents']));
    }

    public function update(CustDebitNoteUpdateRequest $request, CustDebitNote $custDebitNote)
    {
        $this->authorize('update', $custDebitNote);
        $updated = $this->service->update($custDebitNote->id, $request->validated(), Auth::id());

        return (new CustDebitNoteResource($updated))
            ->additional(['message' => 'Debit note updated successfully.']);
    }

    public function destroy(CustDebitNote $custDebitNote)
    {
        $this->authorize('delete', $custDebitNote);
        $this->service->delete($custDebitNote->id, Auth::id());

        return response()->noContent();
    }

    public function downloadPdf(CustDebitNote $custDebitNote, Request $request)
    {
        $this->authorize('view', $custDebitNote);
        $pdf = $this->buildCustDebitNotePdf($custDebitNote, $request->user()?->id);

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

    public function sendEmail(CustDebitNote $custDebitNote, Request $request)
    {
        $this->authorize('view', $custDebitNote);
        $custDebitNote->loadMissing(['invoice.customer', 'invoice.project', 'items']);
        $customer = $custDebitNote->invoice?->customer;

        if (! $customer || empty($customer->email)) {
            return response()->json(['message' => 'Debit note customer email address is missing.'], 422);
        }

        // Try to reuse an existing PDF for this debit note, if available
        $download = Download::where('name', $custDebitNote->debit_note_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildCustDebitNotePdf($custDebitNote, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);
        $projectName = $custDebitNote->invoice?->project?->name;
        $subject = 'Debit Note '.$custDebitNote->debit_note_number.($projectName ? ' - '.$projectName : '');

        try {
            Mail::send('emails.cust-debit-note', [
                'debitNote' => $custDebitNote,
                'recipientName' => $customer->name ?? 'Customer',
                'projectName' => $projectName,
                'fromName' => config('mail.from.name', config('app.name', 'EPMS')),
            ], function ($message) use ($customer, $subject, $fullPath, $fileName) {
                $message->to($customer->email, $customer->name ?? 'Customer')
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as' => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $exception) {
            \Log::error('Failed to send customer debit note email', [
                'debit_note_id' => $custDebitNote->id,
                'error' => $exception->getMessage(),
            ]);

            return response()->json(['message' => 'Failed to send debit note email to customer.'], 500);
        }

        return response()->json(['message' => 'Debit note emailed to customer successfully.']);
    }

    /**
     * Build the customer debit note PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildCustDebitNotePdf(CustDebitNote $custDebitNote, ?int $userId = null): array
    {
        $custDebitNote->loadMissing(['invoice.customer', 'invoice.project', 'items']);
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

        $senderName = $configValues['NAME'] ?? config('app.name', 'EPMS');
        $senderEmail = $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com');

        $options = new Options;
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml(view('pdf.cust-debit-note', [
            'debitNote' => $custDebitNote,
            'senderName' => $senderName,
            'senderEmail' => $senderEmail,
            'senderPhone' => $configValues['PHONE'] ?? null,
            'senderAddress' => implode(', ', array_filter([
                $configValues['ADDRESS_LINE_1'] ?? null,
                $configValues['CITY'] ?? null,
                $configValues['COUNTRY'] ?? null,
            ])),
        ])->render());
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $custDebitNote->debit_note_number.'.pdf';
        $relativePath = 'cust-debit-notes/'.$fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $custDebitNote->debit_note_number]);
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
