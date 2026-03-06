<?php

namespace App\Services;

use App\Models\Currency;

class CurrencyConversionService
{
    /**
     * Convert a monetary amount from invoice currency into base (account) currency.
     *
     * Assumes base currency is KES. The exchange rate returned is the
     * number of base currency units per 1 unit of invoice currency.
     */
    public function convertToBaseFromInvoice(float $amount, ?string $invoiceCurrencyCode, string $baseCurrencyCode = 'KES'): array
    {
        // When invoice currency is same as base, no conversion.
        if ($invoiceCurrencyCode === $baseCurrencyCode) {
            return [
                'exchange_rate'    => 1.0,
                'converted_amount' => $amount,
                'base_currency'    => $baseCurrencyCode,
            ];
        }

        // current_forex_rate is stored as: 1 invoiceCurrency = rate * baseCurrency (KES).
        $invoiceRate = Currency::where('code', $invoiceCurrencyCode)->value('current_forex_rate');

        if (!is_numeric($invoiceRate) || (float) $invoiceRate <= 0.0) {
            $invoiceRate = 1.0;
        }

        $exchangeRate = (float) $invoiceRate;
        $convertedAmount = $amount * $exchangeRate;

        return [
            'exchange_rate'    => $exchangeRate,
            'converted_amount' => $convertedAmount,
            'base_currency'    => $baseCurrencyCode,
        ];
    }
}
