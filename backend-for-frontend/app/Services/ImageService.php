<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function serveLogo(string $filename)
    {
        $path = "logos/{$filename}";
        
        if (!Storage::disk('public')->exists($path)) {
            throw new \Exception('Image not found', 404);
        }

        return Storage::disk('public')->get($path);
    }

    public function getLogoUrl(string $filename): string
    {
        return route('api.images.logos', ['filename' => $filename]);
    }
}
