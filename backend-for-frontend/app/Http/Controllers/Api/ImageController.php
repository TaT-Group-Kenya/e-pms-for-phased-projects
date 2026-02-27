<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ImageService;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    protected $service;

    public function __construct(ImageService $service)
    {
        $this->service = $service;
    }

    public function serveLogo(string $filename)
    {
        // $this->authorize('viewAny', \App\Models\Customer::class);

        $path = "logos/{$filename}";
        
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Image not found'], 404);
        }

        return Storage::disk('public')->download($path);
    }
}
