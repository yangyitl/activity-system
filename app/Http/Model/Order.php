<?php

/**
 * * * * * * * *
 *  用户订单表  *
 * * * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-21
 * Time: 21:23
 */

namespace App\Http\Model;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    public $table = 'order';

    public static function orderLog($id, $pid)
    {

        $log = Order::whereStatusAndPstatusAndUser_idAndPid(1, 1, $id, $pid)
            ->groupBy('order_sn')->get()->toArray();

        foreach ($log as $k => $val) {
            $count = Order::whereOrder_snAndStatusAndPstatusAndPid($val['order_sn'], 2, 2,$pid)->count();
            if ($count) {
                unset($log[$k]);
            }
        }
        $submitAuditOrder = count($log);

        $log = Order::wherePstatusAndUser_id(2, $id)->groupBy('order_sn')->get()->toArray();
        $unAuditOrder = count($log);

        $log = Order::whereStatusAndPstatusAndUser_id(2, 3, $id)->groupBy('order_sn')->get()->toArray();
        foreach ($log as $k => $val) {
            $count = Order::whereOrder_snAndStatusAndPstatusAndPid($val['order_sn'], 2, 2,$pid)->count();
            if ($count) {
                unset($log[$k]);
            }
        }
        $auditOrder = count($log);
        return [$submitAuditOrder, $unAuditOrder, $auditOrder];
    }

    public static function meOrderLog($id)
    {
        //$submitAuditOrder = Order::whereStart_idAndPstatusAndUser_id($id, 1, $id)->count();
        $submitAuditOrder = Order::whereStart_idAndStatusAndUser_id($id, 0, $id)->count();

        $unAuditOrder = Order::whereStart_idAndPstatusAndUser_id($id, 1, $id)->count();

        $auditOrder = Order::whereStart_idAndUser_id($id, $id)->where('pstatus', '>=', 2)->count();
        return [$submitAuditOrder, $unAuditOrder, $auditOrder];
    }
}