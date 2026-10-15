<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShipContainerStoreRequest;
use App\Http\Requests\ShipContainerUpdateRequest;
use App\Http\Resources\ShipContainerResource;
use App\Models\ShipContainer;
use App\Services\ShipContainerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShipContainerController extends Controller
{
    public function __construct(private ShipContainerService $service) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', ShipContainer::class);

        $perPage = (int) $request->query('per_page', 15);
        $page = (int) $request->query('page', 1);
        $filters = $request->except(['per_page', 'page']);

        $containers = $this->service->index($filters, $perPage, $page, 0, ['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']);

        return ShipContainerResource::collection($containers);
    }

    public function store(ShipContainerStoreRequest $request)
    {
        $this->authorize('create', ShipContainer::class);

        $validated = $request->validated();

        $validated['created_by'] = Auth::id();
        $validated['created_at'] = now();
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();

        $container = $this->service->create($validated);

        return new ShipContainerResource($container->load(['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']));
    }

    public function show(Request $request, $shipContainer)
    {
        $id = $this->resolveId($shipContainer, 'ship_container');
        if (empty($id)) {
            return response()->json(['message' => 'Ship container id is required'], 400);
        }

        $container = $this->service->find($id, ['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']);
        $this->authorize('view', $container);

        return new ShipContainerResource($container);
    }

    public function update(ShipContainerUpdateRequest $request, $shipContainer)
    {
        $id = $this->resolveId($shipContainer, 'ship_container');
        if (empty($id)) {
            return response()->json(['message' => 'Ship container id is required'], 400);
        }

        $container = $this->service->find($id);
        $this->authorize('update', $container);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $validated['updated_at'] = now();

        $updated = $this->service->update($id, $validated);

        return new ShipContainerResource($updated->load(['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']));
    }

    public function destroy($shipContainer)
    {
        $id = $this->resolveId($shipContainer, 'ship_container');
        if (empty($id)) {
            return response()->json(['message' => 'Ship container id is required'], 400);
        }

        $container = $this->service->find($id);
        $this->authorize('delete', $container);

        $this->service->delete($id, Auth::id());

        return response()->noContent();
    }

    /**
     * Record (or update) the Get In date - the day transit cargo entered the
     * country. Transit types only.
     */
    public function getIn(Request $request, $shipContainer)
    {
        $id = $this->resolveId($shipContainer, 'ship_container');
        if (empty($id)) {
            return response()->json(['message' => 'Ship container id is required'], 400);
        }

        $container = $this->service->find($id);
        $this->authorize('update', $container);

        $data = $request->validate([
            'get_in' => ['nullable', 'date', 'before_or_equal:now'],
        ]);

        $updated = $this->service->getIn($id, $data['get_in'] ?? null);

        return new ShipContainerResource($updated->load(['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']));
    }

    /**
     * Record the date/time transit cargo exits Kenya borders.
     */
    public function recordExit(Request $request, $shipContainer)
    {
        $id = $this->resolveId($shipContainer, 'ship_container');
        if (empty($id)) {
            return response()->json(['message' => 'Ship container id is required'], 400);
        }

        $container = $this->service->find($id);
        $this->authorize('update', $container);

        // Naive local date-times from browsers can sit a few hours ahead of the
        // app timezone (UTC); compare against end of today so legitimate
        // same-day exits pass while future dates are rejected.
        $data = $request->validate([
            'exit_date' => ['required', 'date', 'before_or_equal:'.now()->endOfDay()->format('Y-m-d H:i:s')],
            'exit_border' => ['nullable', 'string', 'max:255'],
            'exit_remarks' => ['nullable', 'string', 'max:2000'],
            'bond_extension_days' => ['nullable', 'integer', 'min:1', 'max:365'],
        ]);

        $updated = $this->service->recordExit($id, $data);

        return new ShipContainerResource($updated->load(['customer', 'projectOwner', 'allocationLocation', 'cfsLocation', 'numbers', 'createdByUser', 'updatedByUser']));
    }

    /**
     * Listing of transit cargo that reached the configured notification day
     * (default day 25 of 30) without exiting, to prompt extension of the
     * clearing process and bond.
     */
    public function transitNotifications(Request $request)
    {
        $this->authorize('viewAny', ShipContainer::class);

        $rows = $this->service->transitExitNotifications(['customer']);

        return response()->json([
            'data' => $rows,
            'count' => count($rows),
            'generated_at' => now()->toDateTimeString(),
        ]);
    }

    /**
     * Quick counters for the containers landing page tiles.
     */
    public function statistics(Request $request)
    {
        $this->authorize('viewAny', ShipContainer::class);

        return response()->json(['data' => $this->service->statistics()]);
    }

    private function resolveId($shipContainer, string $routeParam): ?int
    {
        if ($shipContainer instanceof ShipContainer) {
            return (int) $shipContainer->id;
        }

        if (is_numeric($shipContainer)) {
            return (int) $shipContainer;
        }

        $routeId = request()->route($routeParam);
        if (is_object($routeId)) {
            return (int) $routeId->id;
        }

        return is_numeric($routeId) ? (int) $routeId : null;
    }
}
