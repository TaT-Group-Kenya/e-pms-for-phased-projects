<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DashboardInformationService;
use App\Http\Resources\Dashboard\ProjectsOverviewResource;
use App\Http\Resources\Dashboard\ProjectsRoadmapResource;
use App\Http\Resources\Dashboard\ProjectsProgressOverviewResource;
use App\Http\Resources\Dashboard\RecentProgressUpdateResource;
use App\Http\Resources\Dashboard\LatestProjectResource;
use App\Http\Resources\Dashboard\ProjectsAnalysisResource;
use App\Http\Resources\Dashboard\CurrencyPreferenceResource;
use App\Http\Resources\Dashboard\PendingCustInvoicesResource;
use App\Http\Resources\Dashboard\PendingCompanyInvoicesResource;
use App\Http\Resources\Dashboard\RecentOrderResource;
use App\Http\Resources\Dashboard\QuotationsOverviewResource;

class DashboardInformationController extends Controller
{
    public function __construct(protected DashboardInformationService $service)
    {
    }

    public function projectsOverview(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);
        $range = $request->get('range', 'last_6_months');

        return new ProjectsOverviewResource($this->service->getProjectsOverview($range));
    }

    public function projectsRoadmap(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);

        $range = $request->get('range', 'this_week');
        $items = $this->service->getProjectsRoadmap($range);

        return ProjectsRoadmapResource::collection(collect($items));
    }

    public function projectsProgressOverview(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);

        $range = $request->get('range', 'last_6_months');
        $data = $this->service->getProjectsProgressOverview($range);

        return new ProjectsProgressOverviewResource($data);
    }

    public function recentProgressUpdates(Request $request)
    {
        $this->authorize('viewAny', \App\Models\ProjectProgressUpdate::class);

        $limit = (int) $request->get('limit', 10);
        $items = $this->service->getRecentProgressUpdates($limit);

        return RecentProgressUpdateResource::collection(collect($items));
    }

    public function latestProjects(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);

        $limit = (int) $request->get('limit', 20);
        $items = $this->service->getLatestProjects($limit);

        return LatestProjectResource::collection(collect($items));
    }

    public function projectsAnalysis(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Project::class);

        $range = $request->get('range', 'last_7_days');
        $data = $this->service->getProjectsAnalysis($range);

        return new ProjectsAnalysisResource($data);
    }

    public function currencyPreference(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoice::class);

        $range = $request->get('range', 'last_7_days');
        $data = $this->service->getCurrencyPreference($range);

        return new CurrencyPreferenceResource($data);
    }

    public function pendingCustInvoices(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoice::class);

        $range = $request->get('range', 'last_7_days');
        $data = $this->service->getPendingCustInvoices($range);

        return new PendingCustInvoicesResource($data);
    }

    public function pendingCompanyInvoices(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CompanyInvoice::class);

        $range = $request->get('range', 'last_7_days');
        $data = $this->service->getPendingCompanyInvoices($range);

        return new PendingCompanyInvoicesResource($data);
    }

    public function recentOrders(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Order::class);

        $range = $request->get('range', 'last_7_days');
        $limit = (int) $request->get('limit', 10);
        $items = $this->service->getRecentOrders($range, $limit);

        return RecentOrderResource::collection(collect($items));
    }

    public function quotationsOverview(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Quotation::class);

        $range = $request->get('range', 'last_7_days');
        $data = $this->service->getQuotationsOverview($range);

        return new QuotationsOverviewResource($data);
    }
}
