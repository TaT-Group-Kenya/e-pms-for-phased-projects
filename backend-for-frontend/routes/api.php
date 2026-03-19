<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('/')->group(function () {
		Route::get('images/logos/{filename}', [App\Http\Controllers\Api\ImageController::class, 'serveLogo'])->name('images.logos');
		Route::post('login', [App\Http\Controllers\Api\AuthController::class, 'login']);
		Route::post('forgot-password', [App\Http\Controllers\Api\AuthController::class, 'forgot']);
		Route::post('reset-password', [App\Http\Controllers\Api\AuthController::class, 'resetPassword']);

	Route::middleware('auth:sanctum')->group(function () {
		   // External Customer User Endpoints
		   Route::prefix('external-customer')->group(function () {
			   Route::get('overview', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'overview']);
			   Route::get('quotations', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'quotations']);
			   Route::get('orders', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'orders']);
			   Route::get('invoices', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'invoices']);
			   Route::get('credit-notes', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'creditNotes']);
			   Route::get('projects', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'projects']);
			   Route::get('payments', [App\Http\Controllers\Api\ExternalCustomerUserController::class, 'payments']);
		   });

		   // External Company User Endpoints
		   Route::prefix('external-company')->group(function () {
			   Route::get('overview', [App\Http\Controllers\Api\ExternalCompanyUserController::class, 'overview']);
			   Route::get('invoices', [App\Http\Controllers\Api\ExternalCompanyUserController::class, 'invoices']);
			   Route::get('credit-notes', [App\Http\Controllers\Api\ExternalCompanyUserController::class, 'creditNotes']);
			   Route::get('projects', [App\Http\Controllers\Api\ExternalCompanyUserController::class, 'projects']);
		   });
		Route::post('office-expenses/{id}/settle', [App\Http\Controllers\Api\OfficeExpenseController::class, 'settleExpense']);
		Route::post('logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
		Route::get('me', [App\Http\Controllers\Api\AuthController::class, 'me']);
		Route::put('me/profile', [App\Http\Controllers\Api\AuthController::class, 'updateProfile']);
		Route::post('me/change-password', [App\Http\Controllers\Api\AuthController::class, 'changePassword']);

		Route::get('accounts/{account}/statement', [App\Http\Controllers\Api\AccountController::class, 'statement']);
		Route::get('accounts/{account}/statement-pdf', [App\Http\Controllers\Api\AccountController::class, 'downloadStatementPdf']);
		Route::post('accounts/{account}/topup', [App\Http\Controllers\Api\AccountController::class, 'topup']);
		Route::apiResource('accounts', App\Http\Controllers\Api\AccountController::class);
		Route::apiResource('account-types', App\Http\Controllers\Api\AccountTypeController::class);
		Route::apiResource('account-groups', App\Http\Controllers\Api\AccountGroupController::class);
		Route::apiResource('companies', App\Http\Controllers\Api\CompanyController::class);
		Route::apiResource('company-banks', App\Http\Controllers\Api\CompanyBankController::class);
		Route::apiResource('company-credit-notes', App\Http\Controllers\Api\CompanyCreditNoteController::class);
		Route::get('company-credit-notes/{companyCreditNote}/download-pdf', [App\Http\Controllers\Api\CompanyCreditNoteController::class, 'downloadPdf']);
		Route::post('company-credit-notes/{companyCreditNote}/send-email', [App\Http\Controllers\Api\CompanyCreditNoteController::class, 'sendEmail']);
		Route::post('company-credit-notes/{companyCreditNote}/refund', [App\Http\Controllers\Api\CompanyCreditNoteController::class, 'refund']);
		Route::apiResource('company-credit-note-items', App\Http\Controllers\Api\CompanyCreditNoteItemController::class);
		Route::get('company-invoices/{companyInvoice}/download-pdf', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'downloadPdf']);
		Route::post('company-invoices/{companyInvoice}/send-email', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'sendEmail']);
		Route::post('company-invoices/{companyInvoice}/payments', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'addPayment']);
		Route::patch('company-invoices/{companyInvoice}/payments/{companyPayment}', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'updatePayment']);
		Route::delete('company-invoices/{companyInvoice}/payments/{companyPayment}', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'deletePayment']);
		Route::post('company-invoices/create-from-phase', [App\Http\Controllers\Api\CompanyInvoiceController::class, 'createFromPhase']);
		Route::apiResource('company-invoices', App\Http\Controllers\Api\CompanyInvoiceController::class);
		Route::apiResource('company-invoice-documents', App\Http\Controllers\Api\CompanyInvoiceDucomentController::class);
		Route::apiResource('company-invoice-items', App\Http\Controllers\Api\CompanyInvoiceItemController::class);
		Route::apiResource('company-payments', App\Http\Controllers\Api\CompanyPaymentController::class);
		Route::apiResource('company-projects', App\Http\Controllers\Api\CompanyProjectController::class);
		Route::apiResource('countries', App\Http\Controllers\Api\CountryController::class);
		Route::apiResource('currencies', App\Http\Controllers\Api\CurrencyController::class);
		Route::apiResource('cust-credit-notes', App\Http\Controllers\Api\CustCreditNoteController::class);
		Route::get('cust-credit-notes/{custCreditNote}/download-pdf', [App\Http\Controllers\Api\CustCreditNoteController::class, 'downloadPdf']);
		Route::post('cust-credit-notes/{custCreditNote}/send-email', [App\Http\Controllers\Api\CustCreditNoteController::class, 'sendEmail']);
		Route::post('cust-credit-notes/{custCreditNote}/refund', [App\Http\Controllers\Api\CustCreditNoteController::class, 'refund']);
		Route::apiResource('cust-credit-note-items', App\Http\Controllers\Api\CustCreditNoteItemController::class);
		Route::get('cust-invoices/{custInvoice}/download-pdf', [App\Http\Controllers\Api\CustInvoiceController::class, 'downloadPdf']);
		Route::post('cust-invoices/{custInvoice}/send-email', [App\Http\Controllers\Api\CustInvoiceController::class, 'sendEmail']);
		Route::post('cust-invoices/{custInvoice}/mark-sent', [App\Http\Controllers\Api\CustInvoiceController::class, 'markSent']);
		Route::post('cust-invoices/{custInvoice}/payments', [App\Http\Controllers\Api\CustInvoiceController::class, 'addPayment']);
		Route::patch('cust-invoices/{custInvoice}/payments/{custPayment}', [App\Http\Controllers\Api\CustInvoiceController::class, 'updatePayment']);
		Route::delete('cust-invoices/{custInvoice}/payments/{custPayment}', [App\Http\Controllers\Api\CustInvoiceController::class, 'deletePayment']);
		Route::post('cust-invoices/create-from-order', [App\Http\Controllers\Api\CustInvoiceController::class, 'createFromOrder']);
		Route::apiResource('cust-invoices', App\Http\Controllers\Api\CustInvoiceController::class);
		Route::apiResource('cust-invoice-documents', App\Http\Controllers\Api\CustInvoiceDocumentController::class);
		Route::apiResource('cust-invoice-items', App\Http\Controllers\Api\CustInvoiceItemController::class);
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
		Route::post('payment-receiving-methods/{id}/restore', [App\Http\Controllers\Api\PaymentReceivingMethodController::class, 'restore']);
		Route::apiResource('payment-receiving-methods', App\Http\Controllers\Api\PaymentReceivingMethodController::class);
		Route::post('payment-methods/{id}/restore', [App\Http\Controllers\Api\PaymentMethodController::class, 'restore']);
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
		Route::get('company-payments/{companyPayment}/download-pdf', [App\Http\Controllers\Api\CompanyPaymentController::class, 'downloadPdf']);
		Route::get('cust-payments/{custPayment}/download-pdf', [App\Http\Controllers\Api\CustPaymentController::class, 'downloadPdf']);
		Route::get('company-transactions-ledger/{company_transactions_ledger}/download-pdf', [App\Http\Controllers\Api\CompanyTransactionsLedgerController::class, 'downloadPdf']);
		Route::get('customer-transactions-ledger/{customer_transactions_ledger}/download-pdf', [App\Http\Controllers\Api\CustomerTransactionsLedgerController::class, 'downloadPdf']);
		Route::get('dashboard/projects-overview', [App\Http\Controllers\Api\DashboardInformationController::class, 'projectsOverview']);
		Route::get('dashboard/projects-roadmap', [App\Http\Controllers\Api\DashboardInformationController::class, 'projectsRoadmap']);
		Route::get('dashboard/projects-progress-overview', [App\Http\Controllers\Api\DashboardInformationController::class, 'projectsProgressOverview']);
		Route::get('dashboard/recent-progress-updates', [App\Http\Controllers\Api\DashboardInformationController::class, 'recentProgressUpdates']);
		Route::get('dashboard/latest-projects', [App\Http\Controllers\Api\DashboardInformationController::class, 'latestProjects']);
		Route::get('dashboard/projects-analysis', [App\Http\Controllers\Api\DashboardInformationController::class, 'projectsAnalysis']);
		Route::get('dashboard/top-customers-by-revenue', [App\Http\Controllers\Api\DashboardInformationController::class, 'topCustomersByRevenue']);
		Route::get('dashboard/recent-orders', [App\Http\Controllers\Api\DashboardInformationController::class, 'recentOrders']);
		Route::get('dashboard/quotations-overview', [App\Http\Controllers\Api\DashboardInformationController::class, 'quotationsOverview']);
		Route::apiResource('office-expenses', App\Http\Controllers\Api\OfficeExpenseController::class);
		Route::apiResource('office-expense-categories', App\Http\Controllers\Api\OfficeExpenseCategoryController::class);
		Route::apiResource('office-expense-payments', App\Http\Controllers\Api\OfficeExpensePaymentController::class);
		// Reporting Endpoints
		Route::prefix('reports')->group(function () {
			Route::get('orders-summary', [App\Http\Controllers\ReportingController::class, 'ordersSummary']);
			Route::get('projects-summary', [App\Http\Controllers\ReportingController::class, 'projectsSummary']);
			Route::get('customer-history', [App\Http\Controllers\ReportingController::class, 'customerHistory']);
			Route::get('revenue', [App\Http\Controllers\ReportingController::class, 'revenueSnapshot']);
			Route::get('invoices', [App\Http\Controllers\ReportingController::class, 'invoicesReport']);
			Route::get('payments-to-companies', [App\Http\Controllers\ReportingController::class, 'paymentsToCompanies']);
			Route::get('margin-per-project', [App\Http\Controllers\ReportingController::class, 'marginPerProject']);
			Route::get('general-ledger', [App\Http\Controllers\ReportingController::class, 'generalLedger']);
			Route::get('invoice-payments', [App\Http\Controllers\ReportingController::class, 'invoicePayments']);
			Route::get('tax-payments-customer', [App\Http\Controllers\ReportingController::class, 'taxPaymentsCustomer']);
			Route::get('tax-payments-company', [App\Http\Controllers\ReportingController::class, 'taxPaymentsCompany']);
			Route::get('expense', [App\Http\Controllers\ReportingController::class, 'expenseReport']);
			Route::get('export-pdf', [App\Http\Controllers\ReportingController::class, 'exportPdf']);
		});
	});
});
