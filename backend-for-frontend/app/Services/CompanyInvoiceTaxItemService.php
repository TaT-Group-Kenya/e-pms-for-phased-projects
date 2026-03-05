<?php

namespace App\Services;

use App\Models\CompanyInvoiceTaxItem;

class CompanyInvoiceTaxItemService
{
    public function index(
        array $filters = [],
        <?php

        // CompanyInvoiceTaxItemService is no longer used. Inline taxes on
        // company_invoice_items have replaced the separate tax item API.
