<?php

namespace App\Console\Commands;

use App\Services\ShipContainerService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class NotifyTransitContainerExits extends Command
{
    protected $signature = 'ship-containers:notify-transit-exits
        {--dry-run : List the containers that would be notified without sending emails}
        {--email= : Override the recipient email address}';

    protected $description = 'Notify about transit containers/units approaching the transit exit deadline so clearing and bond can be extended';

    public function handle(ShipContainerService $service): int
    {
        $rows = $service->transitExitNotifications();

        if (empty($rows)) {
            $this->info('No transit cargo due for exit notification.');

            return Command::SUCCESS;
        }

        if ($this->option('dry-run')) {
            $this->table(
                ['ID', 'Reference', 'Type', 'Client', 'BOL', 'Containers', 'Get In', 'Port In', 'Day', 'Deadline', 'Days Left', 'Overdue'],
                collect($rows)->map(fn ($row) => [
                    $row['id'],
                    $row['reference_number'],
                    $row['container_type'],
                    $row['client'],
                    $row['bol_no'],
                    implode(', ', $row['container_numbers'] ?? []),
                    $row['get_in'],
                    $row['port_in'],
                    $row['day_number'],
                    $row['exit_deadline'],
                    $row['days_remaining'],
                    $row['overdue'] ? 'YES' : 'no',
                ])->all()
            );

            return Command::SUCCESS;
        }

        $toEmail = $this->option('email') ?: env('BACKUP_EMAIL_TO', config('mail.from.address'));

        try {
            Mail::send('emails.transit-exit-notification', [
                'rows' => $rows,
                'generatedAt' => now(),
            ], function ($message) use ($toEmail, $rows) {
                $message->to($toEmail)
                    ->subject(sprintf(
                        '[e-PMS] %d transit cargo due for exit/bond extension - %s',
                        count($rows),
                        now()->format('Y-m-d')
                    ));
            });

            $this->info(sprintf('Transit exit notification sent to %s for %d item(s).', $toEmail, count($rows)));

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Failed to send notification: '.$e->getMessage());

            return Command::FAILURE;
        }
    }
}
