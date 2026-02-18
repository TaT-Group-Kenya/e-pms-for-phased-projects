<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Policies\BaseModelPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        \App\Models\Account::class => BaseModelPolicy::class,
        \App\Models\AccountType::class => BaseModelPolicy::class,
        \App\Models\AccountGroup::class => BaseModelPolicy::class,
        \App\Models\Company::class => BaseModelPolicy::class,
        \App\Models\CompanyBank::class => BaseModelPolicy::class,
        \App\Models\CompanyCreditNote::class => BaseModelPolicy::class,
        \App\Models\CompanyCreditNoteItem::class => BaseModelPolicy::class,
        \App\Models\CompanyCreditNoteTaxItem::class => BaseModelPolicy::class,
        \App\Models\CompanyInvoice::class => BaseModelPolicy::class,
        \App\Models\CompanyInvoiceDucoment::class => BaseModelPolicy::class,
        \App\Models\CompanyInvoiceItem::class => BaseModelPolicy::class,
        \App\Models\CompanyInvoiceTaxItem::class => BaseModelPolicy::class,
        \App\Models\CompanyPayment::class => BaseModelPolicy::class,
        \App\Models\CompanyProject::class => BaseModelPolicy::class,
        \App\Models\Country::class => BaseModelPolicy::class,
        \App\Models\Currency::class => BaseModelPolicy::class,
        \App\Models\CustCreditNote::class => BaseModelPolicy::class,
        \App\Models\CustCreditNoteItem::class => BaseModelPolicy::class,
        \App\Models\CustCreditNoteTaxItem::class => BaseModelPolicy::class,
        \App\Models\CustInvoice::class => BaseModelPolicy::class,
        \App\Models\CustInvoiceDocument::class => BaseModelPolicy::class,
        \App\Models\CustInvoiceItem::class => BaseModelPolicy::class,
        \App\Models\CustInvoiceTaxItem::class => BaseModelPolicy::class,
        \App\Models\CustPaymentAllocation::class => BaseModelPolicy::class,
        \App\Models\Customer::class => BaseModelPolicy::class,
        \App\Models\Department::class => BaseModelPolicy::class,
        \App\Models\Download::class => BaseModelPolicy::class,
        \App\Models\GroupRole::class => BaseModelPolicy::class,
        \App\Models\Language::class => BaseModelPolicy::class,
        \App\Models\Order::class => BaseModelPolicy::class,
        \App\Models\OrderDocument::class => BaseModelPolicy::class,
        \App\Models\OrderItem::class => BaseModelPolicy::class,
        \App\Models\OrderTaxItems::class => BaseModelPolicy::class,
        \App\Models\PaymentMethod::class => BaseModelPolicy::class,
        \App\Models\Project::class => BaseModelPolicy::class,
        \App\Models\ProjectCategory::class => BaseModelPolicy::class,
        \App\Models\ProjectPhase::class => BaseModelPolicy::class,
        \App\Models\ProjectProgressUpdate::class => BaseModelPolicy::class,
        \App\Models\Quotation::class => BaseModelPolicy::class,
        \App\Models\QuoteDocument::class => BaseModelPolicy::class,
        \App\Models\QuoteLineltem::class => BaseModelPolicy::class,
        \App\Models\SysConfig::class => BaseModelPolicy::class,
        \App\Models\SysGroup::class => BaseModelPolicy::class,
        \App\Models\SysRole::class => BaseModelPolicy::class,
        \App\Models\Tax::class => BaseModelPolicy::class,
        \App\Models\Transaction::class => BaseModelPolicy::class,
        \App\Models\User::class => BaseModelPolicy::class,
        \App\Models\UserGroup::class => BaseModelPolicy::class,
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
