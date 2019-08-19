<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

class SiteController extends Controller
{

    public static function config()
    {
        $goodsConfig = config('goods');
        $config = [
            'goods' => array_shift($goodsConfig),
        ];
        self::returnJson($config);
    }

}
