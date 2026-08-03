<?php

namespace App\Services;

use App\Models\ProjectPhase;
use App\Models\SysConfig;
use App\Models\CustInvoice;
use App\Models\CustCreditNote;
use App\Models\CompanyInvoice;
use App\Models\CompanyCreditNote;
use App\Models\Order;
use App\Models\Quotation;

class CommonService
{
    
    /**
     * Generate unique code with format {}-XXXX-XXXX (numeric)
    */
    public function generateUniqueCode($prefix = 'PRP-'): string
    {
       return $prefix . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT) . '-' . str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
    }

    protected function getNextDocumentNumber(
        string $prefixConfig,
        string $incrementConfig,
        string $lengthConfig,
        string $modelClass,
        string $numberColumn
    ): string {
        $prefix = (string) (SysConfig::where('name', $prefixConfig)->value('value') ?? '');
        $increment = (int) (SysConfig::where('name', $incrementConfig)->value('value') ?? 1);
        $length = (int) (SysConfig::where('name', $lengthConfig)->value('value') ?? 6);

        /** @var \Illuminate\Database\Eloquent\Model $modelClass */
        $latest = $modelClass::where('id', '>', 0)
            ->orderBy('id', 'desc')
            ->first();

        $currentNumber = $latest ? (string) $latest->{$numberColumn} : null;
        $currentNumeric = 0;

        if ($currentNumber !== null && $currentNumber !== '') {
            $withoutPrefix = substr($currentNumber, strlen($prefix));
            if ($withoutPrefix !== false && ctype_digit($withoutPrefix)) {
                $currentNumeric = (int) $withoutPrefix;
            }
        }

        $nextNumeric = $currentNumeric + $increment;
        $padded = str_pad((string) $nextNumeric, $length, '0', STR_PAD_LEFT);

        return $prefix . $padded;
    }

    public function getNextCustInvoiceNumber(): string
    {
        return $this->getNextDocumentNumber(
            'CUST_INVOICE_PREFIX',
            'CUST_INVOICE_INCREMENT',
            'CUST_INVOICE_NUMBER_LENGTH',
            CustInvoice::class,
            'invoice_number'
        );
    }

    public function getNextCustCreditNoteNumber(): string
    {
        return $this->getNextDocumentNumber(
            'CUST_CREDIT_NOTE_PREFIX',
            'CUST_CREDIT_NOTE_INCREMENT',
            'CUST_CREDIT_NOTE_NUMBER_LENGTH',
            CustCreditNote::class,
            'credit_note_number'
        );
    }

    public function getNextCompanyInvoiceNumber(): string
    {
        return $this->getNextDocumentNumber(
            'COMPANY_INVOICE_PREFIX',
            'COMPANY_INVOICE_INCREMENT',
            'COMPANY_INVOICE_NUMBER_LENGTH',
            CompanyInvoice::class,
            'invoice_number'
        );
    }

    public function getNextCompanyCreditNoteNumber(): string
    {
        return $this->getNextDocumentNumber(
            'COMPANY_CREDIT_NOTE_PREFIX',
            'COMPANY_CREDIT_NOTE_INCREMENT',
            'COMPANY_CREDIT_NOTE_NUMBER_LENGTH',
            CompanyCreditNote::class,
            'credit_note_number'
        );
    }

    public function getNextOrderNumber(): string
    {
        return $this->getNextDocumentNumber(
            'ORDER_NUMBER_PREFIX',
            'ORDER_NUMBER_INCREMENT',
            'ORDER_NUMBER_LENGTH',
            Order::class,
            'order_number'
        );
    }

    public function getNextQuotationNumber(): string
    {
        return $this->getNextDocumentNumber(
            'QUOTATION_NUMBER_PREFIX',
            'QUOTATION_NUMBER_INCREMENT',
            'QUOTATION_NUMBER_LENGTH',
            Quotation::class,
            'quotation_number'
        );
    }
}