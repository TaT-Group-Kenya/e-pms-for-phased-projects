<?php

namespace Database\Seeders;

use App\Models\Quotation;
use App\Models\ShipContainer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuotationSeeder extends Seeder
{
    /**
     * Seed a handful of quotations each bound 1:1 to an unlinked ship
     * container entry, deriving bol_number from the container numbers.
     */
    public function run(): void
    {
        $containers = ShipContainer::with(['customer', 'projectOwner', 'numbers'])
            ->where('is_deleted', false)
            ->orderBy('id')
            ->get();

        if ($containers->isEmpty()) {
            $this->command?->warn('Run ShipContainerSeeder first — no ship containers found.');

            return;
        }

        $adminId = DB::table('users')->where('email', 'admin@example.com')->value('id') ?? 1;
        $prefix = (string) (DB::table('sys_configs')->where('name', 'QUOTATION_NUMBER_PREFIX')->value('value') ?? 'QUO-');
        $length = max(1, (int) (DB::table('sys_configs')->where('name', 'QUOTATION_NUMBER_LENGTH')->value('value') ?? 6));

        // Every quotation must be linked 1:1 — take free containers only
        $linkedIds = Quotation::withDeleted()->pluck('ship_container_id')->filter()->all();

        $free = $containers->reject(fn (ShipContainer $container) => in_array($container->id, $linkedIds))->take(4);

        if ($free->isEmpty()) {
            $this->command?->warn('All ship containers are already linked to quotations.');

            return;
        }

        $statuses = ['draft', 'sent', 'approved'];

        foreach ($free->values() as $index => $container) {
            $numbers = $container->numbers->pluck('container_no')->all();
            $count = max(1, count($numbers));

            // No line items are seeded: totals stay zero until items are added
            // (matching quotations created through the form).

            Quotation::create([
                'quotation_number' => $prefix.str_pad((string) ($index + 1), $length, '0', STR_PAD_LEFT),
                'ship_container_id' => $container->id,
                // bol_number = the linked entry's single BOL/BL number
                'bol_number' => $container->bl_no ?? $container->bol_no,
                'customer_id' => $container->customer_id,
                'project_owner_id' => $container->project_owner_id,
                'title' => "Clearing & transport — {$container->reference_number}",
                'description' => "Handling, port charges and clearance for {$count} container(s).",
                'status' => $statuses[$index % count($statuses)],
                'valid_until_date' => now()->addDays(30)->toDateString(),
                'subtotal_amount' => 0,
                'tax_amount' => 0,
                'discount_percentage' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'currency' => 'KES',
                'min_approval_count' => 1,
                'notes_to_customer' => 'Quotation generated from the linked ship container entry.',
                'created_by' => $adminId,
                'updated_by' => $adminId,
            ]);

            $this->command?->info("Seeded quotation for {$container->reference_number} ({$count} container(s)).");
        }
    }
}
