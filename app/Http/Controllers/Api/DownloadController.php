<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
        $data = $this->service->index($request->all(), $perPage);
        return DownloadResource::collection($data);
    }

    public function store(DownloadStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
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

        $updated = $this->service->update($download->id, $request->validated());
        return new DownloadResource($updated);
    }

    public function destroy(Download $download)
    {
        $this->authorize('delete', $download);

        $this->service->delete($download->id);
        return response()->noContent();
    }
}