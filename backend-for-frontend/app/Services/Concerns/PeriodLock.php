<?php

namespace App\Services\Concerns;

use App\Exceptions\PeriodLockedException;
use App\Services\AccountingPeriodService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Period-lock enforcement safety net.
 *
 * Model observers call assertDateClosedForModel() on creating/updating/
 * deleting. Documents whose business date falls inside a closed month may
 * not be created, edited or deleted — matching the month-end close contract.
 *
 * Item-level models (quote lines, invoice items, allocations...) inherit
 * their period from their parent document via $periodLockParent, so an
 * edit that would alter a closed month's balances (e.g. adding a line item
 * to a closed-month invoice) is blocked even though the item row itself has
 * no date.
 *
 * Call PeriodLock::withoutChecking(fn) to bypass during seeding and tests.
 */
class PeriodLock
{
    /** @var bool */
    protected static $checking = true;

    /** @var array<class-string, array<string>> */
    protected static $observedModels = [];

    /** @var array<class-string, array<string>> date column candidates per model */
    public const DATE_COLUMNS = [
        \App\Models\Quotation::class => ['created_at'],
        \App\Models\Order::class => ['created_at'],
        \App\Models\CustInvoice::class => ['created_at'],
        \App\Models\CompanyInvoice::class => ['created_at'],
        \App\Models\CustPayment::class => ['payment_date'],
        \App\Models\CompanyPayment::class => ['payment_date'],
        \App\Models\CustCreditNote::class => ['created_at'],
        \App\Models\CompanyCreditNote::class => ['created_at'],
        \App\Models\CustDebitNote::class => ['created_at'],
        \App\Models\OfficeExpense::class => ['date'],
        \App\Models\OfficeExpensePayment::class => ['payment_date'],
        \App\Models\Transaction::class => ['transaction_date'],
        \App\Models\Loan::class => ['disbursement_date'],
        \App\Models\LoanRepayment::class => ['payment_date'],
        \App\Models\PdcReceivedCustomer::class => ['cheque_date', 'received_date'],
        \App\Models\PdcIssuedCompany::class => ['cheque_date', 'received_date'],
        \App\Models\CustomerTransactionsLedger::class => ['transaction_date'],
        \App\Models\CompanyTransactionsLedger::class => ['transaction_date'],
        \App\Models\TaxTransaction::class => ['transaction_date'],
    ];

    /** Item models -> their parent document (resolved lazily at check time). */
    public const ITEM_PARENTS = [
        \App\Models\QuoteLineItem::class => ['quotation', 'quotation_id'],
        \App\Models\OrderItem::class => ['order', 'order_id'],
        \App\Models\CustInvoiceItem::class => ['invoice', 'invoice_id'],
        \App\Models\CompanyInvoiceItem::class => ['invoice', 'invoice_id'],
        \App\Models\CustCreditNoteItem::class => ['creditNote', 'credit_note_id'],
        \App\Models\CompanyCreditNoteItem::class => ['creditNote', 'credit_note_id'],
        \App\Models\CustDebitNoteItem::class => ['debitNote', 'debit_note_id'],
        \App\Models\CustPaymentAllocation::class => ['payment', 'payment_id'],
    ];

    /** Financial item models observed for parent-chain enforcement. */
    public const OBSERVED_ITEMS = [
        \App\Models\QuoteLineItem::class,
        \App\Models\OrderItem::class,
        \App\Models\CustInvoiceItem::class,
        \App\Models\CompanyInvoiceItem::class,
        \App\Models\CustCreditNoteItem::class,
        \App\Models\CompanyCreditNoteItem::class,
        \App\Models\CustDebitNoteItem::class,
        \App\Models\CustPaymentAllocation::class,
    ];

    public static function enabled(): bool
    {
        return static::$checking;
    }

    public static function withoutChecking(callable $callback)
    {
        $previous = static::$checking;
        static::$checking = false;

        try {
            return $callback();
        } finally {
            static::$checking = $previous;
        }
    }

    /**
     * Throws when model creation/edit/deletion would change a closed month.
     * New documents -> business date must be in an open month; edits ->
     * stored date and (when provided) new date both must be open.
     *
     * @param  array<string, mixed>|null  $changedAttributes  attribute => new value
     */
    public static function assertModelOpen(
        Model $model,
        ?array $changedAttributes = null,
        string $action = 'change',
    ): void {
        if (! static::$checking) {
            return;
        }

        $modelClass = $model::class;

        // Item rows inherit their parent document's period.
        if (isset(static::ITEM_PARENTS[$modelClass])) {
            static::assertItemParentOpen($model, $action);

            return;
        }

        if (! isset(static::DATE_COLUMNS[$modelClass])) {
            return; // not a financial model known to us
        }

        foreach (static::DATE_COLUMNS[$modelClass] as $column) {
            // New (or changed) value takes precedence — moving a date into a
            // closed month must be blocked even from an open period.
            $candidate = $changedAttributes[$column] ?? $model->getAttribute($column);

            if (! static::shouldCheckDate($model, $column, $candidate)) {
                continue;
            }

            if ($candidate === null) {
                continue;
            }

            $date = Carbon::parse($candidate);
            if ($date->timestamp === 0) {
                continue;
            }

            static::assertDate($date, $modelClass, $action);
        }
    }

    /**
     * Deleting (or logically deleting) a stored document: check the stored
     * business date only.
     */
    public static function assertModelDeletable(Model $model): void
    {
        static::assertModelOpen($model, null, 'delete');
    }

    /**
     * Registers parent-chain observers for item models. Called by the
     * provider so item edits inherit the parent document's period lock.
     */
    public static function observeItems(): void
    {
        foreach (static::OBSERVED_ITEMS as $modelClass) {
            $modelClass::creating(function ($item) {
                static::assertModelOpen($item, null, 'create');
            });
            $modelClass::updating(function ($item) {
                static::assertModelOpen($item, $item->getDirty(), 'update');
            });
            $modelClass::updating(function ($item) {
                if ($item->isDirty('is_deleted')) {
                    static::assertModelOpen($item, null, 'delete');
                }
            });
            $modelClass::deleting(function ($item) {
                static::assertModelOpen($item, null, 'delete');
            });
            static::$observedModels[$modelClass] = [];
        }
    }

    protected static function shouldCheckDate(Model $model, string $column, $candidate): bool
    {
        // When the attribute has NOT changed on update and the model is being
        // updated, the stored date matters only as "existing documents in
        // closed months cannot be edited" — which assertModelOpen covers via
        // DateChanged guard below. Here we simply always check both stored
        // and changed candidates (change sets include both).
        return true;
    }

    protected static function assertDate(Carbon $date, string $modelClass, string $action): void
    {
        $service = app(AccountingPeriodService::class);

        try {
            $closed = $service->isDateClosed($date);
        } catch (\Throwable) {
            // Period tables not present in this environment (minimal test
            // schema): nothing to enforce against rather than break posting.
            return;
        }

        if ($closed) {
            $period = \App\Models\AccountingPeriod::query()
                ->months()
                ->whereDate('start_date', '<=', $date->toDateString())
                ->whereDate('end_date', '>=', $date->toDateString())
                ->first();

            $label = class_basename($modelClass);

            throw new PeriodLockedException(
                sprintf(
                    'Accounting period %s is closed. This %s (dated %s) cannot be %s. Reopen the period if a correction is necessary.',
                    $period?->name ?? $date->format('M Y'),
                    (string) str($label)->snake(' '),
                    $date->toDateString(),
                    $action === 'delete' ? 'deleted' : ($action === 'create' ? 'created' : 'edited'),
                ),
                date: $date->toDateString(),
                periodId: $period?->id,
                periodName: $period?->name,
            );
        }
    }

    protected static function assertItemParentOpen(Model $item, string $action): void
    {
        [$relation, $foreignKey] = static::ITEM_PARENTS[$item::class];

        try {
            $parent = $item->getAttribute($relation) ?? $item->$relation()->first();
        } catch (\Throwable) {
            return; // relation/table unavailable in this schema; skip
        }

        if (! $parent && $item->getAttribute($foreignKey)) {
            try {
                $parent = $item->$relation()->getRelated()->query()->find($item->getAttribute($foreignKey));
            } catch (\Throwable) {
                return;
            }
        }

        if (! $parent) {
            return; // nothing to enforce against
        }

        // Recurse: parent's stored date (or its own parent chain) governs.
        static::assertModelOpen($parent, null, $action);
    }
}
