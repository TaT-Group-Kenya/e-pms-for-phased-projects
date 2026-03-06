<?php

namespace App\Services;

use App\Models\CustInvoiceTaxItem;

class CustInvoiceTaxItemService
{
    public function index(
        array $filters = [],
        <?php

        // CustInvoiceTaxItemService is no longer used. Inline taxes on
        // cust_invoice_items have replaced the separate tax item API.
