<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Maker/checker (four-eyes) workflow for accounting periods:
 * a maker with ROLE_MAKER_ACCOUNTING_PERIOD submits a close/reopen request;
 * a different user with ROLE_CHECKER_ACCOUNTING_PERIOD approves or rejects
 * it. Approval by the checker executes the underlying operation atomically.
 *
 * Roles:
 *  - ROLE_MAKER_ACCOUNTING_PERIOD  : can submit close/reopen requests
 *  - ROLE_CHECKER_ACCOUNTING_PERIOD: can approve/reject submitted requests
 */
return new class extends Migration
{
    /** Groups that carry the close duty today receive checker; finance-ish groups get maker. */
    public function up(): void
    {
        Schema::create('accounting_period_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accounting_period_id');
            $table->string('action'); // close | reopen
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('requested_by'); // maker
            $table->timestamp('requested_at');
            $table->text('reason')->nullable(); // maker's justification (required for reopen)
            $table->decimal('forex_rate', 15, 6)->nullable(); // snapshot rate for close requests
            $table->string('checklist_summary', 1000)->nullable(); // stranded drafts at submission
            $table->unsignedBigInteger('reviewed_by')->nullable(); // checker
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable(); // checker's response note
            $table->unsignedBigInteger('executed_log_id')->nullable(); // accounting_period_logs row on approval
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('accounting_period_id', 'fk_apreq_period')
                ->references('id')->on('accounting_periods')->onDelete('cascade');

            $table->index(['status', 'action'], 'ix_apreq_status_action');
            $table->index(['accounting_period_id', 'status'], 'ix_apreq_period_status');
        });

        if (! Schema::hasTable('sys_roles')) {
            return;
        }

        $roles = [
            'ROLE_MAKER_ACCOUNTING_PERIOD' => 'Submit accounting period close/reopen requests (maker)',
            'ROLE_CHECKER_ACCOUNTING_PERIOD' => 'Approve or reject accounting period close/reopen requests (four-eyes checker)',
        ];

        $roleIds = [];
        foreach ($roles as $role => $description) {
            \DB::table('sys_roles')->insertOrIgnore([
                'name' => $role,
                'description' => $description,
                'is_deleted' => false,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $roleIds = \DB::table('sys_roles')
            ->whereIn('name', array_keys($roles))
            ->where('is_deleted', false)
            ->pluck('id', 'name');

        if ($roleIds->isEmpty()) {
            return;
        }

        // Makers: same audience as period viewers (finance people raise requests).
        $viewerGroups = \DB::table('group_roles')
            ->join('sys_groups', function ($join) {
                $join->on('sys_groups.id', '=', 'group_roles.group_id')
                    ->where('sys_groups.is_deleted', false);
            })
            ->where('group_roles.is_deleted', false)
            ->distinct()
            ->pluck('group_id');

        foreach ($viewerGroups as $groupId) {
            \DB::table('group_roles')->insertOrIgnore([
                'group_id' => $groupId,
                'role_id' => $roleIds->get('ROLE_MAKER_ACCOUNTING_PERIOD'),
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Checkers: groups with the close duty (the people who used to close
        // directly) become checkers; reopen stays administrator-only, so the
        // Administrators group also gets checker for reopen approvals.
        foreach ($roleIds->only(['ROLE_CHECKER_ACCOUNTING_PERIOD']) as $roleId) {
            foreach ($viewerGroups as $groupId) {
                \DB::table('group_roles')->insertOrIgnore([
                    'group_id' => $groupId,
                    'role_id' => $roleId,
                    'is_deleted' => false,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('sys_roles')) {
            $roleIds = \DB::table('sys_roles')
                ->whereIn('name', ['ROLE_MAKER_ACCOUNTING_PERIOD', 'ROLE_CHECKER_ACCOUNTING_PERIOD'])
                ->pluck('id');

            if ($roleIds->isNotEmpty() && Schema::hasTable('group_roles')) {
                \DB::table('group_roles')->whereIn('role_id', $roleIds)->delete();
            }

            \DB::table('sys_roles')->whereIn('id', $roleIds)->delete();
        }

        Schema::dropIfExists('accounting_period_requests');
    }
};
