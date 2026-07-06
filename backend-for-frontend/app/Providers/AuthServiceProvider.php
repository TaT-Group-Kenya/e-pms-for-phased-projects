<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\{
    AccountPolicy,
    AccountTypePolicy,
    AccountGroupPolicy,
    CompanyPolicy,
    CompanyBankPolicy,
    CompanyCreditNotePolicy,
    CompanyCreditNoteItemPolicy,
    CompanyInvoicePolicy,
    CompanyInvoiceDocumentPolicy,
    CompanyInvoiceItemPolicy,
    CompanyPaymentPolicy,
    CompanyProjectPolicy,
    CountryPolicy,
    CurrencyPolicy,
    CustCreditNotePolicy,
    CustCreditNoteItemPolicy,
    CustInvoicePolicy,
    CustInvoiceDocumentPolicy,
    CustInvoiceItemPolicy,
    CustPaymentPolicy,
    CustPaymentAllocationPolicy,
    CustomerPolicy,
    DepartmentPolicy,
    DownloadPolicy,
    GroupRolePolicy,
    LanguagePolicy,
    OfficeExpenseDocumentPolicy,
    OfficeExpensePolicy,
    OfficeExpenseCategoryPolicy,
    OfficeExpensePaymentPolicy,
    OrderPolicy,
    OrderDocumentPolicy,
    OrderItemPolicy,
    PaymentMethodPolicy,
    ProjectPolicy,
    ProjectCategoryPolicy,
    ProjectPhasePolicy,
    ProjectProgressUpdatePolicy,
    ProjectSourceOriginPolicy,
    ProjectLocationPolicy,
    QuotationPolicy,
    QuoteDocumentPolicy,
    QuoteLineItemPolicy,
    QuoteApprovalPolicy,
    SysConfigPolicy,
    SysGroupPolicy,
    SysRolePolicy,
    TaxPolicy,
    TransactionPolicy,
    UserPolicy,
    UserGroupPolicy,
    CompanyTransactionsLedgerPolicy,
    CustomerTransactionsLedgerPolicy,
    PdcReceivedCustomerPolicy,
    PdcIssuedCompanyPolicy,
};

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        \App\Models\Account::class => AccountPolicy::class,
        \App\Models\AccountType::class => AccountTypePolicy::class,
        \App\Models\AccountGroup::class => AccountGroupPolicy::class,
        \App\Models\Company::class => CompanyPolicy::class,
        \App\Models\CompanyBank::class => CompanyBankPolicy::class,
        \App\Models\CompanyCreditNote::class => CompanyCreditNotePolicy::class,
        \App\Models\CompanyCreditNoteItem::class => CompanyCreditNoteItemPolicy::class,
        \App\Models\CompanyInvoice::class => CompanyInvoicePolicy::class,
        \App\Models\CompanyInvoiceDocument::class => CompanyInvoiceDocumentPolicy::class,
        \App\Models\CompanyInvoiceItem::class => CompanyInvoiceItemPolicy::class,
        \App\Models\CompanyPayment::class => CompanyPaymentPolicy::class,
        \App\Models\CompanyProject::class => CompanyProjectPolicy::class,
        \App\Models\Country::class => CountryPolicy::class,
        \App\Models\Currency::class => CurrencyPolicy::class,
        \App\Models\CustCreditNote::class => CustCreditNotePolicy::class,
        \App\Models\CustCreditNoteItem::class => CustCreditNoteItemPolicy::class,
        \App\Models\CustInvoice::class => CustInvoicePolicy::class,
        \App\Models\CustInvoiceDocument::class => CustInvoiceDocumentPolicy::class,
        \App\Models\CustInvoiceItem::class => CustInvoiceItemPolicy::class,
        \App\Models\CustPayment::class => CustPaymentPolicy::class,
        \App\Models\CustPaymentAllocation::class => CustPaymentAllocationPolicy::class,
        \App\Models\Customer::class => CustomerPolicy::class,
        \App\Models\Department::class => DepartmentPolicy::class,
        \App\Models\Download::class => DownloadPolicy::class,
        \App\Models\GroupRole::class => GroupRolePolicy::class,
        \App\Models\Language::class => LanguagePolicy::class,
        \App\Models\OfficeExpenseDocument::class => OfficeExpenseDocumentPolicy::class,
        \App\Models\Order::class => OrderPolicy::class,
        \App\Models\OrderDocument::class => OrderDocumentPolicy::class,
        \App\Models\OrderItem::class => OrderItemPolicy::class,
        \App\Models\PaymentMethod::class => PaymentMethodPolicy::class,
        \App\Models\Project::class => ProjectPolicy::class,
        \App\Models\ProjectCategory::class => ProjectCategoryPolicy::class,
        \App\Models\ProjectSourceOrigin::class => ProjectSourceOriginPolicy::class,
        \App\Models\ProjectLocation::class => ProjectLocationPolicy::class,
        \App\Models\ProjectPhase::class => ProjectPhasePolicy::class,
        \App\Models\ProjectProgressUpdate::class => ProjectProgressUpdatePolicy::class,
        \App\Models\Quotation::class => QuotationPolicy::class,
        \App\Models\QuoteDocument::class => QuoteDocumentPolicy::class,
        \App\Models\QuoteLineItem::class => QuoteLineItemPolicy::class,
        \App\Models\QuoteApproval::class => QuoteApprovalPolicy::class,
        \App\Models\SysConfig::class => SysConfigPolicy::class,
        \App\Models\SysGroup::class => SysGroupPolicy::class,
        \App\Models\SysRole::class => SysRolePolicy::class,
        \App\Models\Tax::class => TaxPolicy::class,
        \App\Models\Transaction::class => TransactionPolicy::class,
        \App\Models\User::class => UserPolicy::class,
        \App\Models\UserGroup::class => UserGroupPolicy::class,
        \App\Models\CompanyTransactionsLedger::class => CompanyTransactionsLedgerPolicy::class,
        \App\Models\CustomerTransactionsLedger::class => CustomerTransactionsLedgerPolicy::class,
        \App\Models\PdcReceivedCustomer::class => PdcReceivedCustomerPolicy::class,
        \App\Models\PdcIssuedCompany::class => PdcIssuedCompanyPolicy::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->registerPolicies();
    }
}

