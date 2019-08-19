<?php

/**
 * * * * * * * *
 * 首页展示数据  *
 * * * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-23
 * Time: 12:09
 */

namespace App\Http\Controllers\Admin;

use App\Http\Model\Order;
use App\Http\Model\Users;

class IndexController extends AdminController
{


    /**
     * 首页展示数据
     */
    public function index()
    {

        ini_set('memory_limit', '1024M'); //设置程序运行的内存

        $orderMap        = [
            ['id', '>', 0],
            ['status', '>=', 0]
        ];
        $totalUserNum    = Users::where([['id', '>', 0]])->count();
        $totalOrderNum   = Order::where($orderMap)->groupby('order_sn')->get()->toArray();
        $totalOrderNum   = count($totalOrderNum);
        $totalOrder      = Order::where($orderMap)->groupby('order_sn')->get()->toArray();
        $totalOrderMoney = $totalOrderP = 0;
        foreach ($totalOrder as $val) {
            $totalOrderMoney += $val['total_amount'];
            $totalOrderP     += $val['number'];
        }
        unset($val);
        $totalOrderMoney = $this->decimal($totalOrderMoney);

        $result = [
            'totalUserNum'    => $totalUserNum,
            'totalOrderNum'   => $totalOrderNum,
            'totalOrderMoney' => $totalOrderMoney,
            'totalOrderP'     => $totalOrderP
        ];

        self::returnJson($result, 200);

    }

}