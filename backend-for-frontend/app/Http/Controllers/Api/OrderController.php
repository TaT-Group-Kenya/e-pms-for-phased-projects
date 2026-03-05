<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Models\Order;
use App\Models\Quotation;
use App\Models\QuoteLineItem;
use App\Models\OrderItem;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\CustInvoice;
use App\Models\CustInvoiceItem;
use App\Models\CustInvoiceTaxItem;
use App\Models\Download;
use App\Models\SysConfig;
use App\Services\CommonService;
use App\Services\OrderService;
use App\Services\OrderToCustInvoiceService;
use App\Services\ProjectService;
use App\Http\Resources\OrderResource;
use App\Http\Resources\CustInvoiceResource;
use App\Http\Requests\OrderStoreRequest;
use App\Http\Requests\OrderUpdateRequest;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $service;
    protected $orderToCustInvoiceService;

    protected $projectService;

    public function __construct(OrderService $service, OrderToCustInvoiceService $orderToCustInvoiceService, ProjectService $projectService) {
        $this->service = $service;
        $this->orderToCustInvoiceService = $orderToCustInvoiceService;
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Order::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return OrderResource::collection($data);
    }

    public function store(OrderStoreRequest $request)
    {
        $model = DB::transaction(function () use ($request) {
            $validated = $request->validated();

            // If an order is being linked to a quotation, enforce the
            // same business rules as generateFromQuotation: the
            // quotation must be approved and must not already have an order.
            if (!empty($validated['quotation_id'])) {
                $quotation = Quotation::with(['order', 'quoteItems'])
                    ->findOrFail($validated['quotation_id']);

                if ($quotation->status !== 'approved') {
                    return response()->json([
                        'message' => 'Order can only be created from approved quotations.',
                        'errors' => [
                            'status' => ['Quotation must be approved before creating an order.'],
                        ],
                    ], 422);
                }

                if ($quotation->order) {
                    return response()->json([
                        'message' => 'An order already exists for this quotation.',
                        'errors' => [
                            'quotation_id' => ['Only one order is allowed per quotation.'],
                        ],
                    ], 422);
                }
            }

            $overrides = [
                'project_id'        => $validated['project_id']       ?? null,
                'customer_id'       => $validated['customer_id']      ?? null,
                'title'             => $validated['title']            ?? null,
                'description'       => $validated['description']      ?? null,
                'status'            => $validated['status']           ?? 'sent',
                'payment_terms'     => $validated['payment_terms']    ?? null,
                'notes_to_customer' => $validated['notes_to_customer']?? null,
            ];

            // Remove null overrides so quotation values are used where
            // fields are not explicitly provided.
            $overrides = array_filter($overrides, static fn ($value) => $value !== null);

            return $this->service->createFromQuotation(
                $quotation,
                $overrides,
                $request->user()?->id
            );
        });

        // If the transaction returned an error response, forward it
        if ($model instanceof \Illuminate\Http\JsonResponse) {
            return $model;
        }

        return new OrderResource($model);
    }

    /**
     * Generate an order from an approved quotation.
     */
    public function generateFromQuotation(Request $request)
    {
        $request->validate([
            'quotation_id' => ['required', 'integer', 'exists:quotations,id'],
        ]);
        $order = DB::transaction(function () use ($request) {
            $quotation = Quotation::with(['quoteItems', 'order'])
                ->findOrFail($request->input('quotation_id'));

            // Only allow generation from approved quotations without an existing order
            if ($quotation->status !== 'approved') {
                return response()->json([
                    'message' => 'Order can only be generated from approved quotations.',
                    'errors' => [
                        'status' => ['Quotation must be approved before generating an order.'],
                    ],
                ], 422);
            }

            if ($quotation->order) {
                return response()->json([
                    'message' => 'An order already exists for this quotation.',
                    'errors' => [
                        'quotation_id' => ['Only one order is allowed per quotation.'],
                    ],
                ], 422);
            }

            // Delegate creation (header + items + tax items) to the service,
            // using quotation financials and defaulting status to "sent".
            $order = $this->service->createFromQuotation(
                $quotation,
                ['status' => 'sent'],
                $request->user()?->id
            );

            return $order;
        });

        // If the transaction returned an error response, forward it
        if ($order instanceof \Illuminate\Http\JsonResponse) {
            return $order;
        }

        return new OrderResource($order);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        return DB::transaction(function () use ($order) {
            $order->loadMissing(['orderItems', 'documents', 'project', 'customer', 'quotation']);
            return new OrderResource($order);
        });
    }

    public function update(OrderUpdateRequest $request, Order $order)
    {
        $this->authorize('update', $order);

        // Once an order is approved, it cannot be edited directly.
        if ($order->status === 'approved') {
            return response()->json([
                'message' => 'Approved orders cannot be edited. Unapprove the order first if you need to make changes.',
                'errors'  => [
                    'status' => ['This order is approved and locked for editing.'],
                ],
            ], 422);
        }

        $updated = DB::transaction(function () use ($request, $order) {
            $oldStatus = $order->status;
            $userId = $request->user()?->id;

            $updatedOrder = $this->service->update($order->id, $request->validated());

            // When an order is moved to approved status, automatically
            // generate a draft customer invoice (if none exists yet)
            // by copying order header, items and tax items.
            if ($oldStatus !== 'approved' && $updatedOrder->status === 'approved') {
                // Ensure the order is linked to a project before creating an invoice,
                // because customer invoices require a non-null project_id.
                $updatedOrder->loadMissing(['project']);
                if (! $updatedOrder->project) {
                    $project = $this->createProjectFromOrder($updatedOrder, $userId);

                    $updatedOrder->project_id = $project->id;
                    $updatedOrder->save();
                    $updatedOrder->refresh();
                }

                // Avoid creating duplicate invoices if one already exists
                if (! $updatedOrder->custInvoices()->exists()) {
                    $this->orderToCustInvoiceService->createInvoiceFromOrder(
                        $updatedOrder,
                        $userId
                    );
                }
            }

            return $updatedOrder;
        });

        return new OrderResource($updated);
    }

    /**
     * Create a draft project based on an approved order.
     */
    protected function createProjectFromOrder(Order $order, ?int $userId = null): Project
    {
        $commonService = new CommonService();
        do {
            $code = $commonService->generateUniqueCode('PRJ-');
        } while (Project::where('code', $code)->exists());

        $name = 'Project for order ' . $order->order_number;

        $projectData = [
            'code'                  => $code,
            'name'                  => $name,
            'description'           => $order->description,
            'order_id'              => $order->id,
            'customer_id'           => $order->customer_id,
            'project_category_id'   => null,
            'project_source_origin_id' => null,
            'project_location_id'   => null,
            'no_of_phases'          => '1',
            'start_date'            => now()->toDateString(),
            'end_date'              => now()->addMonth()->toDateString(),
            'budget_estimate'       => $order->total_amount,
            'status'                => 'draft',
            'priority'              => 'medium',
            'progress'              => '0',
            'tags'                  => null,
            'currency'              => $order->currency,
            'created_by'            => $userId,
            'updated_by'            => $userId,
        ];

        return $this->projectService->create($projectData);
    }

    /**
     * Explicitly generate a customer invoice from an approved order.
     */
    public function generateCustInvoice(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        if ($order->status !== 'approved') {
            return response()->json([
                'message' => 'Invoice can only be generated from approved orders.',
                'errors'  => [
                    'status' => ['Order must be approved before generating an invoice.'],
                ],
            ], 422);
        }

        if ($order->custInvoices()->exists()) {
            return response()->json([
                'message' => 'An invoice already exists for this order.',
                'errors'  => [
                    'order_id' => ['Only one customer invoice is allowed per order.'],
                ],
            ], 422);
        }

        $overrides = $request->only([
            'title',
            'description',
            'payment_terms',
            'notes_to_customer',
        ]);

        $invoice = DB::transaction(function () use ($request, $order, $overrides) {
            $userId = $request->user()?->id;

            // Ensure the order is linked to a project before creating an invoice,
            // because customer invoices require a non-null project_id.
            $order->loadMissing(['project']);
            if (! $order->project) {
                $project = $this->createProjectFromOrder($order, $userId);
                $order->project_id = $project->id;
                $order->save();
                $order->refresh();
            }

            return $this->orderToCustInvoiceService->createInvoiceFromOrder(
                $order,
                $userId,
                $overrides
            );
        });

        return new CustInvoiceResource($invoice);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);

        return DB::transaction(function () use ($order) {
            // Prevent deleting orders that have customer invoices
            if ($order->custInvoices()->exists()) {
                return response()->json([
                    'message' => 'Order cannot be deleted because it has linked customer invoices.',
                    'errors' => [
                        'order' => ['Delete any related customer invoices before deleting the order.'],
                    ],
                ], 422);
            }

            // Soft delete order items and related records, then the order itself
            $deletedBy = Auth::id();

            $order->orderItems()->get()->each(function (OrderItem $item) use ($deletedBy) {
                $item->softDelete($deletedBy);
            });

            $order->documents()->get()->each(function ($doc) use ($deletedBy) {
                if (method_exists($doc, 'softDelete')) {
                    $doc->softDelete($deletedBy);
                }
            });

            $this->service->delete($order->id, $deletedBy);
            return response()->noContent();
        });
    }

    /**
     * Generate and download a PDF representation of the order.
     * The PDF is stored as {order_number}.pdf under the public disk
     * and a corresponding entry is recorded/updated in the downloads table.
     */
    public function downloadPdf(Order $order, Request $request)
    {
        $this->authorize('view', $order);

        $pdf = $this->buildOrderPdf($order, $request->user()?->id);

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
     * Send the order PDF to the customer via email.
     * If a PDF already exists for this order, reuse it; otherwise generate a new one.
     */
    public function sendEmail(Order $order, Request $request)
    {
        $this->authorize('view', $order);

        $order->loadMissing(['customer', 'project']);

        if (! $order->customer || empty($order->customer->email)) {
            return response()->json([
                'message' => 'Order customer email address is missing.',
            ], 422);
        }

        // Try to reuse an existing PDF for this order, if available
        $download = Download::where('name', $order->order_number)->first();

        if ($download && Storage::disk('public')->exists($download->path)) {
            $relativePath = $download->path;
            $fileName = basename($download->path);
        } else {
            $pdf = $this->buildOrderPdf($order, $request->user()?->id);
            $relativePath = $pdf['relativePath'];
            $fileName = $pdf['fileName'];
        }

        $fullPath = Storage::disk('public')->path($relativePath);

        $recipientName = $order->customer->name ?? 'Customer';
        $projectName = $order->project->name ?? null;
        $fromName = config('mail.from.name', config('app.name', 'EPMS'));

        $subject = sprintf(
            'Order %s%s',
            $order->order_number,
            $projectName ? ' - ' . $projectName : ''
        );

        $mailData = [
            'order'         => $order,
            'recipientName' => $recipientName,
            'projectName'   => $projectName,
            'fromName'      => $fromName,
        ];

        try {
            Mail::send('emails.order', $mailData, function ($message) use ($order, $recipientName, $subject, $fullPath, $fileName) {
                $message->to($order->customer->email, $recipientName)
                    ->subject($subject)
                    ->attach($fullPath, [
                        'as'   => $fileName,
                        'mime' => 'application/pdf',
                    ]);
            });
        } catch (\Throwable $e) {
            \Log::error('Failed to send order email', [
                'order_id' => $order->id,
                'error'    => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to send order email to customer.',
            ], 500);
        }

        return response()->json([
            'message' => 'Order emailed to customer successfully.',
        ]);
    }

    /**
     * Unapprove an order: change status back to 'sent' and, if there is a
     * generated customer invoice with no payments, delete that invoice and
     * its related items/tax items/documents. If any related invoice has
     * payments, the order cannot be unapproved.
     */
    public function unapprove(Order $order, Request $request)
    {
        $this->authorize('update', $order);

        if ($order->status !== 'approved') {
            return response()->json([
                'message' => 'Only approved orders can be unapproved.',
                'errors'  => [
                    'status' => ['This order is not currently approved.'],
                ],
            ], 422);
        }

        $updated = DB::transaction(function () use ($order, $request) {
            $order->loadMissing(['custInvoices.payments', 'custInvoices.invoiceItems', 'custInvoices.documents']);

            $invoices = $order->custInvoices;

            if ($invoices->isNotEmpty()) {
                foreach ($invoices as $invoice) {
                    if ($invoice->payments()->exists()) {
                        return response()->json([
                            'message' => 'Order cannot be unapproved because a related customer invoice has recorded payments.',
                            'errors'  => [
                                'invoice' => ['Reverse or remove payments before unapproving the order.'],
                            ],
                        ], 422);
                    }
                }

                foreach ($invoices as $invoice) {
                    $deletedBy = $request->user()?->id;

                    $invoice->invoiceItems()->get()->each(function (\App\Models\CustInvoiceItem $item) use ($deletedBy) {
                        $item->softDelete($deletedBy);
                    });

                    $invoice->documents()->get()->each(function (\App\Models\CustInvoiceDocument $doc) use ($deletedBy) {
                        $doc->softDelete($deletedBy);
                    });

                    $invoice->softDelete($deletedBy);
                }
            }

            $order->status = 'sent';
            $order->updated_by = $request->user()?->id;
            $order->save();

            $order->refresh();

            return $order;
        });

        if ($updated instanceof \Illuminate\Http\JsonResponse) {
            return $updated;
        }

        return new OrderResource($updated);
    }

    /**
     * Build the order PDF, persist it to storage and track it in downloads.
     *
     * @return array{fileName: string, relativePath: string, output: string}
     */
    protected function buildOrderPdf(Order $order, ?int $userId = null): array
    {
        $order->loadMissing([
            'project',
            'customer',
            'orderItems',
            'taxitems',
            'documents',
            'quotation',
        ]);

        $configValues = SysConfig::whereIn('name', [
            'NAME',
            'EMAIL',
            'ADDRESS_LINE_1',
            'CITY',
            'STATE',
            'COUNTRY',
            'PHONE',
            'WEBSITE',
        ])->pluck('value', 'name');

        $senderName = $configValues['NAME'] ?? config('app.name', 'EPMS');
        $senderEmail = $configValues['EMAIL'] ?? config('mail.from.address', 'no-reply@example.com');
        $generatedAt = now();

        $data = [
            'order'             => $order,
            'senderName'        => $senderName,
            'senderEmail'       => $senderEmail,
            'senderPhone'       => $configValues['PHONE']   ?? null,
            'senderWebsite'     => $configValues['WEBSITE'] ?? config('app.url'),
            'senderAddressLine1'=> $configValues['ADDRESS_LINE_1'] ?? null,
            'senderCity'        => $configValues['CITY']    ?? null,
            'senderState'       => $configValues['STATE']   ?? null,
            'senderCountry'     => $configValues['COUNTRY'] ?? null,
            'generatedAt'       => $generatedAt,
        ];

        $html = view('pdf.order', $data)->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $output = $dompdf->output();

        $fileName = $order->order_number . '.pdf';
        $relativePath = 'orders/' . $fileName;

        Storage::disk('public')->put($relativePath, $output);

        $download = Download::firstOrNew(['name' => $order->order_number]);
        $download->path = $relativePath;
        $download->updated_at = now();
        $download->updated_by = $userId;
        if (! $download->exists) {
            $download->created_at = now();
            $download->created_by = $userId;
        }
        $download->save();

        return [
            'fileName'     => $fileName,
            'relativePath' => $relativePath,
            'output'       => $output,
        ];
    }
}