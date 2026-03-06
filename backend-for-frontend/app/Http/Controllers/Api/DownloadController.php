<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Download;
use App\Services\DownloadService;
use App\Http\Resources\DownloadResource;
use App\Http\Requests\DownloadStoreRequest;
use App\Http\Requests\DownloadUpdateRequest;

class DownloadController extends Controller
{
    protected $service;

    public function __construct(DownloadService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Download::class);
        $perPage = (int) ($request->get('per_page', 15));
        $page = (int) ($request->get('page', 1));
        $filters = $request->except('per_page', 'page');
        $data = $this->service->index($filters, $perPage, $page);
        return DownloadResource::collection($data);
    }

    public function store(DownloadStoreRequest $request)
    {
        $this->authorize('create', \App\Models\Download::class);
        $validated = $request->validated();
        $validated['created_by'] = Auth::id();
        $model = $this->service->create($validated);
        return new DownloadResource($model);
    }

    public function show(Download $download)
    {
        $this->authorize('view', $download);

        return new DownloadResource($download);
    }

    public function update(DownloadUpdateRequest $request, Download $download)
    {
        $this->authorize('update', $download);

        $validated = $request->validated();
        $validated['updated_by'] = Auth::id();
        $updated = $this->service->update($download->id, $validated);
        return new DownloadResource($updated);
    }

    public function destroy(Download $download)
    {
        $this->authorize('delete', $download);

        $this->service->delete($download->id);
        return response()->noContent();
    }
}