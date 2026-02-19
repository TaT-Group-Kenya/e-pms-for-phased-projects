<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    public function hello()
    {
        return 'Hello Laravel, I made this!';
    }
}

public function hello()
{
    return view('hello'); // corresponds to hello.blade.php
}
