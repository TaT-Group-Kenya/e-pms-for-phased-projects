<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyInvoiceItem extends Model
{
    protected $table = 'company_invoice_items';

    protected $fillable = [
        'invoice_id',
        'project_phase_id',
        'item_name',
        'item_description',
        'item_amount',
        'is_taxable',
        'tax_id',
        'tax_item_name',
        'item_type',
        'item_value',
        'tax_amount',
        'updated_at',
        'updated_by',
        'created_at',
        'created_by',
        'is_deleted',
        'deleted_at',
        'deleted_by',
    ];

    public function invoice()
    {
        return $this->belongsTo(CompanyInvoice::class, 'invoice_id');
    }

    public function projectPhase()
    {
        return $this->belongsTo(ProjectPhase::class, 'project_phase_id');
    }

    protected static function booted(): void
    {
        static::saving(function (CompanyInvoiceItem $item) {
            $isTaxable = (bool) ($item->is_taxable ?? false);

            if (! $isTaxable) {
                $item->tax_amount = 0;
                return;
            }

            $baseAmount = $item->item_amount ?? 0;
            $value = $item->item_value !== null ? (float) $item->item_value : 0.0;

            if ($item->item_type === 'fixed') {
                $item->tax_amount = $value;
            } elseif ($item->item_type === 'percent') {
                $item->tax_amount = $baseAmount * ($value / 100);
            }
        });

        $recalculateInvoiceTotals = function (CompanyInvoiceItem $item) {
            if (! $item->invoice_id) {
                return;
            }

            $invoice = $item->invoice()->with('invoiceItems')->first();
            if (! $invoice) {
                return;
            }

            $subtotal = $invoice->invoiceItems->sum(function (CompanyInvoiceItem $line) {
                return (float) ($line->item_amount ?? 0);
            });

            $taxAmount = $invoice->invoiceItems->sum(function (CompanyInvoiceItem $line) {
                return (float) ($line->tax_amount ?? 0);
            });

            $discountPercentage = (float) ($invoice->discount_percentage ?? 0);
            $discountAmount = $subtotal * ($discountPercentage / 100);

            $invoice->subtotal_amount = $subtotal;
            $invoice->tax_amount = $taxAmount;
            $invoice->discount_amount = $discountAmount;
            $invoice->total_amount = $subtotal + $taxAmount - $discountAmount;

            $invoice->save();
        };

        static::saved($recalculateInvoiceTotals);
        static::deleted($recalculateInvoiceTotals);
    }
}