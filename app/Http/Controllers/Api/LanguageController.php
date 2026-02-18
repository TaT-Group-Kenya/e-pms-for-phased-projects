<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Language;
use App\Services\LanguageService;
use App\Http\Resources\LanguageResource;
use App\Http\Requests\LanguageStoreRequest;
use App\Http\Requests\LanguageUpdateRequest;

class LanguageController extends Controller
{
    protected $service;

    public function __construct(LanguageService $service) {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', \App\Models\Language::class);
        $perPage = (int) ($request->get('per_page', 15));
        $data = $this->service->index($request->all(), $perPage);
        return LanguageResource::collection($data);
    }

    public function store(LanguageStoreRequest $request)
    {
        $model = $this->service->create($request->validated());
        return new LanguageResource($model);
    }

    public function show(Language $language)
    {
        $this->authorize('view', $language);

        return new LanguageResource($language);
    }

    public function update(LanguageUpdateRequest $request, Language $language)
    {
        $this->authorize('update', $language);

        $updated = $this->service->update($language->id, $request->validated());
        return new LanguageResource($updated);
    }

    public function destroy(Language $language)
    {
        $this->authorize('delete', $language);

        $this->service->delete($language->id);
        return response()->noContent();
    }
}