<?php

namespace Database\Seeders;

use App\Models\CustDebitNote;
use App\Models\CustDebitNoteItem;
use App\Models\CustInvoice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SampleCustDebitNoteSeeder extends Seeder
{
    public function run(): void
    {
        // Sample data seeder: safe to run anywhere, it is idempotent and only
        // seeds when the target invoice exists and the sample is not present yet.
        if (app()->environment('production') && ! env('ALLOW_SAMPLE_SEEDERS', false)) {
            return;
        }

        $invoice = CustInvoice::find(4);
        if (! $invoice) {
            $this->command?->warn('Sample debit note skipped: cust invoice #4 not found.');

            return;
        }

        if (CustDebitNote::where('invoice_id', $invoice->id)->where('title', 'Additional shipment handling fee')->exists()) {
            $this->command?->info('Sample debit note already exists.');

            return;
        }

        $note = DB::transaction(function () use ($invoice) {
            // Run through the real service so numbering follows CUST_DEBIT_NOTE_* configs
            $note = (new \App\Services\CustDebitNoteService)->create([
                'invoice_id' => $invoice->id,
                'title' => 'Additional shipment handling fee',
                'description' => 'Sample charge: extra handling applied after the original invoice was issued.',
                'notes_to_customer' => 'Please note an additional handling fee has been added to your account.',
            ]);

            (new \App\Services\CustDebitNoteItemService)->create([
                'debit_note_id' => $note->id,
                'item_name' => 'Additional handling fee',
                'item_description' => 'Manual handling of consignment documents',
                'item_amount' => 250,
                'quantity' => 1,
                'is_taxable' => false,
            ]);

            (new \App\Services\CustDebitNoteItemService)->create([
                'debit_note_id' => $note->id,
                'item_name' => 'Document amendment charge',
                'item_description' => 'Amendment of BOL documents',
                'item_amount' => 100,
                'quantity' => 2,
                'is_taxable' => true,
                'tax_item_name' => 'VAT 16%',
                'item_type' => 'percent',
                'item_value' => 16,
            ]);

            return $note;
        });

        $this->command?->info("Sample debit note {$note->debit_note_number} created for invoice {$invoice->invoice_number} (total ".number_format((float) $note->total_amount, 2).').');
    }
}
