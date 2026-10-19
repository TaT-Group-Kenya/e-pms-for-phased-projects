<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TemporaryOperationalDataCleanupSeeder extends Seeder
{
    public function run(): void
    {
        $deleted = DB::transaction(function (): array {
            $projectIds = DB::table('projects')->pluck('id')->all();
            $phaseIds = DB::table('project_phases')->pluck('id')->all();
            $orderIds = DB::table('orders')->pluck('id')->all();
            $customerInvoiceIds = DB::table('cust_invoices')->pluck('id')->all();
            $customerCreditNoteIds = DB::table('cust_credit_notes')
                ->whereIn('invoice_id', $customerInvoiceIds)
                ->pluck('id')
                ->all();
            $customerDebitNoteIds = DB::table('cust_debit_notes')
                ->whereIn('invoice_id', $customerInvoiceIds)
                ->pluck('id')
                ->all();

            $companyInvoiceIds = [];
            if ($projectIds !== [] || $phaseIds !== []) {
                $companyInvoiceQuery = DB::table('company_invoices')
                    ->where(function ($query) use ($projectIds, $phaseIds): void {
                        if ($projectIds !== []) {
                            $query->whereIn('project_id', $projectIds);
                        }
                        if ($phaseIds !== []) {
                            $method = $projectIds === [] ? 'whereIn' : 'orWhereIn';
                            $query->{$method}('project_phase_id', $phaseIds);
                        }
                    });
                $companyInvoiceIds = $companyInvoiceQuery->pluck('id')->all();
            }
            $companyCreditNoteIds = DB::table('company_credit_notes')
                ->whereIn('invoice_id', $companyInvoiceIds)
                ->pluck('id')
                ->all();
            $companyPaymentIds = DB::table('company_payments')
                ->whereIn('invoice_id', $companyInvoiceIds)
                ->pluck('id')
                ->all();
            $companyPaymentTransactionIds = DB::table('company_payments')
                ->whereIn('id', $companyPaymentIds)
                ->whereNotNull('transaction_id')
                ->pluck('transaction_id')
                ->all();

            $transactionSources = [
                'cust_invoice' => $customerInvoiceIds,
                'customer_credit_note' => $customerCreditNoteIds,
                'customer_debit_note' => $customerDebitNoteIds,
                'company_invoice' => $companyInvoiceIds,
                'company_credit_note' => $companyCreditNoteIds,
            ];
            $transactionQuery = DB::table('transactions')->whereRaw('1 = 0');
            foreach ($transactionSources as $sourceType => $sourceIds) {
                if ($sourceIds !== []) {
                    $transactionQuery->orWhere(function ($query) use ($sourceType, $sourceIds): void {
                        $query->where('source_type', $sourceType)->whereIn('source_id', $sourceIds);
                    });
                }
            }
            $transactionIds = array_values(array_unique(array_merge(
                $transactionQuery->pluck('id')->all(),
                $companyPaymentTransactionIds,
            )));

            $customerLedgerQuery = DB::table('customer_transactions_ledger')->whereRaw('1 = 0');
            foreach (array_slice($transactionSources, 0, 3, true) as $sourceType => $sourceIds) {
                if ($sourceIds !== []) {
                    $customerLedgerQuery->orWhere(function ($query) use ($sourceType, $sourceIds): void {
                        $query->where('source_type', $sourceType)->whereIn('source_id', $sourceIds);
                    });
                }
            }
            $deleted['customer_transactions_ledger'] = $customerLedgerQuery->delete();

            $companyLedgerQuery = DB::table('company_transactions_ledger')->whereRaw('1 = 0');
            foreach (array_slice($transactionSources, 3, 2, true) as $sourceType => $sourceIds) {
                if ($sourceIds !== []) {
                    $companyLedgerQuery->orWhere(function ($query) use ($sourceType, $sourceIds): void {
                        $query->where('source_type', $sourceType)->whereIn('source_id', $sourceIds);
                    });
                }
            }
            $deleted['company_transactions_ledger'] = $companyLedgerQuery->delete();

            $deleted['company_payments'] = $this->deleteWhereIn('company_payments', 'id', $companyPaymentIds);
            $deleted['pdc_received_customers'] = $this->deleteWhereIn('pdc_received_customers', 'invoice_id', $customerInvoiceIds);

            if ($transactionIds !== []) {
                DB::table('transactions')->whereIn('related_transaction_id', $transactionIds)
                    ->update(['related_transaction_id' => null]);
                DB::table('pdc_received_customers')->whereIn('related_transaction_id', $transactionIds)
                    ->update(['related_transaction_id' => null]);
                $deleted['transactions'] = DB::table('transactions')->whereIn('id', $transactionIds)->delete();
            } else {
                $deleted['transactions'] = 0;
            }

            // Break the nullable project/order cycle before deleting either side.
            if ($projectIds !== []) {
                DB::table('projects')->whereIn('id', $projectIds)->update(['order_id' => null]);
            }
            if ($orderIds !== []) {
                DB::table('orders')->whereIn('id', $orderIds)->update(['project_id' => null]);
            }

            $deleted['ship_containers'] = DB::table('ship_containers')->delete();
            $deleted['cust_invoices'] = DB::table('cust_invoices')->delete();
            $deleted['company_invoices'] = $this->deleteWhereIn('company_invoices', 'id', $companyInvoiceIds);
            $deleted['quotations'] = DB::table('quotations')->delete();
            $deleted['orders'] = DB::table('orders')->delete();
            $deleted['project_progress_updates'] = DB::table('project_progress_updates')->delete();
            $deleted['company_projects'] = DB::table('company_projects')->delete();
            $deleted['project_phases'] = DB::table('project_phases')->delete();
            $deleted['projects'] = DB::table('projects')->delete();

            return $deleted;
        });

        $this->command?->warn('Destructive cleanup completed. Dependent customer and company invoice records were also removed.');
        foreach ($deleted as $table => $count) {
            $this->command?->line("{$table}: {$count} rows");
        }
        $this->command?->warn('Document database rows were removed by cascades; stored document files were left untouched.');
    }

    private function deleteWhereIn(string $table, string $column, array $values): int
    {
        if ($values === []) {
            return 0;
        }

        return DB::table($table)->whereIn($column, $values)->delete();
    }
}
