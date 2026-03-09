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
use App\Http\Resources\Dashboard\TopCustomerByRevenueResource;
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

    public function topCustomersByRevenue(Request $request)
    {
        $this->authorize('viewAny', \App\Models\CustInvoice::class);

        $range = $request->get('range', 'last_7_days');
        $limit = (int) $request->get('limit', 5);
        $items = $this->service->getTopCustomersByRevenue($range, $limit);

        return TopCustomerByRevenueResource::collection(collect($items));
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
