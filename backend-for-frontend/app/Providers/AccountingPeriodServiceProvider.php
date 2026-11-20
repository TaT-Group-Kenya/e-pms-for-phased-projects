<?php

namespace App\Providers;

use App\Models\AccountingPeriod;
use App\Models\CustCreditNote;
use App\Models\CustDebitNote;
use App\Models\CustInvoice;
use App\Models\CustPayment;
use App\Models\CompanyCreditNote;
use App\Models\CompanyInvoice;
use App\Models\CompanyPayment;
use App\Models\Loan;
use App\Models\LoanRepayment;
use App\Models\OfficeExpense;
use App\Models\OfficeExpensePayment;
use App\Models\Order;
use App\Models\PdcIssuedCompany;
use App\Models\PdcReceivedCustomer;
use App\Models\Quotation;
use App\Models\CompanyTransactionsLedger;
use App\Models\CustomerTransactionsLedger;
use App\Models\TaxTransaction;
use App\Models\Transaction;
use App\Services\Concerns\PeriodLock;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;

/**
 * Registers accounting-period lock observers on every financial model as a
 * safety net around the explicit checks wired in controllers/services.
 */
class AccountingPeriodServiceProvider extends ServiceProvider
{
    /** Financial models without their own HasLogicalDeletion boot conflicts. */
    protected array $observed = [
        Quotation::class,
        Order::class,
        CustInvoice::class,
        CompanyInvoice::class,
        CustCreditNote::class,
        CompanyCreditNote::class,
        CustDebitNote::class,
        CustPayment::class,
        CompanyPayment::class,
        OfficeExpense::class,
        OfficeExpensePayment::class,
        Transaction::class,
        Loan::class,
        LoanRepayment::class,
        PdcReceivedCustomer::class,
        PdcIssuedCompany::class,
        CustomerTransactionsLedger::class,
        CompanyTransactionsLedger::class,
        TaxTransaction::class,
    ];
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Seeders and queue workers should never fail on period locks.
        if ($this->app->runningInConsole() && $this->isSeederRun()) {
            PeriodLock::withoutChecking(fn () => null);
        }

        foreach ($this->observed as $modelClass) {
            $modelClass::creating(function ($model) {
                PeriodLock::assertModelOpen($model, null, 'create');
            });

            $modelClass::updating(function ($model) {
                $dirty = $model->getDirty();
                if ($model->isDirty('is_deleted') && count($dirty) === 1) {
                    // Pure soft-delete flag flip: treat as deletion.
                    PeriodLock::assertModelDeletable($model);
                    return;
                }
                PeriodLock::assertModelOpen($model, $dirty, 'update');
            });

            $modelClass::deleting(function ($model) {
                PeriodLock::assertModelDeletable($model);
            });
        }

        // Item-level models (quote lines, invoice items, allocations...)
        // inherit their parent document's period.
        PeriodLock::observeItems();
    }

    protected function isSeederRun(): bool
    {
        global $argv;

        $command = $argv[1] ?? '';
        if (in_array($command, ['db:seed', 'migrate:fresh', 'migrate:fresh --seed', 'migrate:refresh'], true)) {
            return true;
        }

        if ($command === 'migrate' && in_array('--seed', $argv, true)) {
            return true;
        }

        return false;
    }
}
