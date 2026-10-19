<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Transit Cargo Exit Notification</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Transit Cargo Approaching Exit Deadline</h2>

    <p>The following transit cargo is on or past day {{ $rows[0]['notify_day'] ?? 25 }} of the
        {{ $rows[0]['exit_days'] ?? 30 }}-day transit window and has not yet exited Kenya.
        Please organise the extension of the clearing process and bond.</p>

    @foreach ($rows as $row)
        @php
            $numbers = $row['container_numbers'] ?? [];
        @endphp
        <table style="border-collapse: collapse; width: 100%; max-width: 900px; margin: 20px 0;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: left; {{ $row['overdue'] ? 'color: #c0392b;' : '' }}">
                        {{ $row['reference_number'] }} — {{ str_replace('_', ' ', $row['container_type']) }}
                        @if ($row['overdue'])
                            (overdue)
                        @endif
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd; width: 240px;"><strong>Client Name</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ $row['client'] ?? '—' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>{{ count($numbers) > 1 ? 'Container Numbers' : 'Container Number' }} ({{ count($numbers) }})</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">
                        {{ count($numbers) ? implode(', ', $numbers) : '—' }}
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>BOL No</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ $row['bol_no'] ?? '—' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Get In (Arrival)</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ $row['get_in'] ?? $row['eta'] ?? '—' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Port In</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ $row['port_in'] ?? '—' }}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Day of transit window</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">Day {{ $row['day_number'] }} of {{ $row['exit_days'] }} (notified from day {{ $row['notify_day'] }})</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Exit Deadline</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd; {{ ($row['days_remaining'] ?? 0) <= 0 ? 'color: #c0392b; font-weight: bold;' : '' }}">
                        {{ $row['exit_deadline'] }} — {{ ($row['days_remaining'] ?? 0) <= 0 ? 'overdue' : $row['days_remaining'].' day(s) left' }}
                    </td>
                </tr>
            </tbody>
        </table>
    @endforeach

    <p style="color: #888; font-size: 12px;">
        Generated automatically by e-PMS on {{ $generatedAt->format('Y-m-d H:i') }}.
    </p>
</body>
</html>