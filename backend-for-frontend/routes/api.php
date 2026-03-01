<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/')->group(function () {
		Route::get('images/logos/{filename}', [App\Http\Controllers\Api\ImageController::class, 'serveLogo'])->name('images.logos');
		Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login']);
		Route::post('forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgot']);
		Route::post('reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);

	Route::middleware('auth:sanctum')->group(function () {
		Route::post('logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
		Route::get('me', [App\Http\Controllers\Api\AuthController::class, 'me']);

		Route::apiResource('accounts', App\Http\Controllers\Api\AccountController::class);
		Route::apiResource('account-types', App\Http\Controllers\Api\AccountTypeController::class);
		Route::apiResource('account-groups', App\Http\Controllers\Api\AccountGroupController::class);
		Route::apiResource('companies', App\Http\Controllers\Api\CompanyController::class);
		Route::apiResource('company-banks', App\Http\Controllers\Api\CompanyBankController::class);
		Route::apiResource('company-credit-notes', App\Http\Controllers\Api\CompanyCreditNoteController::class);
		Route::apiResource('company-credit-note-items', App\Http\Controllers\Api\CompanyCreditNoteItemController::class);
		Route::apiResource('company-credit-note-tax-items', App\Http\Controllers\Api\CompanyCreditNoteTaxItemController::class);
		Route::get('company-invoices/{companyInvoice}/download-pdf', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'downloadPdf']);
		Route::post('company-invoices/{companyInvoice}/send-email', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'sendEmail']);
		Route::post('company-invoices/{companyInvoice}/payments', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'addPayment']);
		Route::post('company-invoices/create-from-phase', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'createFromPhase']);
		Route::apiResource('company-invoices', App\Http\Controllers\Api\CompanyInvoiceController::class);
		Route::apiResource('company-invoice-documents', App\Http\Controllers\Api\CompanyInvoiceDucomentController::class);
		Route::apiResource('company-invoice-items', App\Http\Controllers\Api\CompanyInvoiceItemController::class);
		Route::apiResource('company-invoice-tax-items', App\Http\Controllers\Api\CompanyInvoiceTaxItemController::class);
		Route::apiResource('company-payments', App\Http\Controllers\Api\CompanyPaymentController::class);
		Route::apiResource('company-projects', App\Http\Controllers\Api\CompanyProjectController::class);
		Route::apiResource('countries', App\Http\Controllers\Api\CountryController::class);
		Route::apiResource('currencies', App\Http\Controllers\Api\CurrencyController::class);
		Route::apiResource('cust-credit-notes', App\Http\Controllers\Api\CustCreditNoteController::class);
		Route::apiResource('cust-credit-note-items', App\Http\Controllers\Api\CustCreditNoteItemController::class);
		Route::apiResource('cust-credit-note-tax-items', App\Http\Controllers\Api\CustCreditNoteTaxItemController::class);
		Route::get('cust-invoices/{custInvoice}/download-pdf', [App\Http\Controllers\Api\CustInvoiceController::class, 'downloadPdf']);
		Route::post('cust-invoices/{custInvoice}/send-email', [App\Http\Controllers\Api\CustInvoiceController::class, 'sendEmail']);
		Route::post('cust-invoices/{custInvoice}/mark-sent', [App\Http\Controllers\Api\CustInvoiceController::class, 'markSent']);
		Route::post('cust-invoices/{custInvoice}/payments', [App\Http\Controllers\Api\CustInvoiceController::class, 'addPayment']);
		Route::post('cust-invoices/create-from-order', [App\Http\Controllers\Api\CustInvoiceController::class, 'createFromOrder']);
		Route::apiResource('cust-invoices', App\Http\Controllers\Api\CustInvoiceController::class);
		Route::apiResource('cust-invoice-documents', App\Http\Controllers\Api\CustInvoiceDocumentController::class);
		Route::apiResource('cust-invoice-items', App\Http\Controllers\Api\CustInvoiceItemController::class);
		Route::apiResource('cust-invoice-tax-items', App\Http\Controllers\Api\CustInvoiceTaxItemController::class);
		Route::apiResource('cust-payment-allocations', App\Http\Controllers\Api\CustPaymentAllocationController::class);
		Route::apiResource('cust-payments', App\Http\Controllers\Api\CustPaymentController::class);
		Route::apiResource('customers', App\Http\Controllers\Api\CustomerController::class);
		Route::apiResource('departments', App\Http\Controllers\Api\DepartmentController::class);
		Route::apiResource('downloads', App\Http\Controllers\Api\DownloadController::class);
		Route::apiResource('group-roles', App\Http\Controllers\Api\GroupRoleController::class);
		Route::apiResource('languages', App\Http\Controllers\Api\LanguageController::class);
		Route::get('orders/{order}/download-pdf', [App\Http\Controllers\Api\OrderController::class, 'downloadPdf']);
		Route::post('orders/{order}/send-email', [App\Http\Controllers\Api\OrderController::class, 'sendEmail']);
		Route::post('orders/{order}/generate-cust-invoice', [App\Http\Controllers\Api\OrderController::class, 'generateCustInvoice']);
		Route::post('orders/{order}/unapprove', [App\Http\Controllers\Api\OrderController::class, 'unapprove']);
		Route::apiResource('orders', App\Http\Controllers\Api\OrderController::class);
		Route::post('orders/generate-from-quotation', [App\Http\Controllers\Api\OrderController::class, 'generateFromQuotation']);
		Route::get('order-documents/{orderDocument}/download', [App\Http\Controllers\Api\OrderDocumentController::class, 'download']);
		Route::apiResource('order-documents', App\Http\Controllers\Api\OrderDocumentController::class);
		Route::apiResource('order-items', App\Http\Controllers\Api\OrderItemController::class);
		Route::apiResource('order-tax-items', App\Http\Controllers\Api\OrderTaxItemController::class);
		Route::apiResource('payment-methods', App\Http\Controllers\Api\PaymentMethodController::class);
		Route::apiResource('projects', App\Http\Controllers\Api\ProjectController::class);
		Route::apiResource('project-categories', App\Http\Controllers\Api\ProjectCategoryController::class);
		Route::apiResource('project-source-origins', App\Http\Controllers\Api\ProjectSourceOriginController::class);
		Route::apiResource('project-locations', App\Http\Controllers\Api\ProjectLocationController::class);
		Route::apiResource('project-phases', App\Http\Controllers\Api\ProjectPhaseController::class);
		Route::apiResource('project-progress-updates', App\Http\Controllers\Api\ProjectProgressUpdateController::class);
		Route::get('quotations/{quotation}/download-pdf', [App\Http\Controllers\Api\QuotationController::class, 'downloadPdf']);
		Route::post('quotations/{quotation}/send-email', [App\Http\Controllers\Api\QuotationController::class, 'sendEmail']);
		Route::apiResource('quotations', App\Http\Controllers\Api\QuotationController::class);
		Route::apiResource('quote-documents', App\Http\Controllers\Api\QuoteDocumentController::class);
		Route::apiResource('quote-line-items', App\Http\Controllers\Api\QuoteLineItemController::class);
		Route::apiResource('quote-approvals', App\Http\Controllers\Api\QuoteApprovalController::class);
		Route::apiResource('quotation-tax-items', App\Http\Controllers\Api\QuotationTaxItemController::class);
		Route::apiResource('sys-configs', App\Http\Controllers\Api\SysConfigController::class);
		Route::apiResource('sys-groups', App\Http\Controllers\Api\SysGroupController::class);
		Route::apiResource('sys-roles', App\Http\Controllers\Api\SysRoleController::class);
		Route::apiResource('taxes', App\Http\Controllers\Api\TaxController::class);
		Route::apiResource('transactions', App\Http\Controllers\Api\TransactionController::class);
		Route::apiResource('users', App\Http\Controllers\Api\UserController::class);
		Route::apiResource('user-groups', App\Http\Controllers\Api\UserGroupController::class);
		Route::apiResource('company-transactions-ledger', App\Http\Controllers\Api\CompanyTransactionsLedgerController::class)
			->parameter('company-transactions-ledger', 'company_transactions_ledger');
		Route::apiResource('customer-transactions-ledger', App\Http\Controllers\Api\CustomerTransactionsLedgerController::class)
			->parameter('customer-transactions-ledger', 'customer_transactions_ledger');
		Route::get('transactions/{transaction}/download-pdf', [App\Http\Controllers\Api\TransactionController::class, 'downloadPdf']);
		Route::get('company-transactions-ledger/{company_transactions_ledger}/download-pdf', [App\Http\Controllers\Api\CompanyTransactionsLedgerController::class, 'downloadPdf']);
		Route::get('customer-transactions-ledger/{customer_transactions_ledger}/download-pdf', [App\Http\Controllers\Api\CustomerTransactionsLedgerController::class, 'downloadPdf']);
	});
});
