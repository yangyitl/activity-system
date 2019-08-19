<?php

namespace App\Http\Controllers\User;

class SiteController extends BasisController
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
