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

class OrderSubmit extends Model
{

    public $table = 'order_submit';

    public static function orderLog($id)
    {
        $submitAuditOrder = Order::whereStatusAndUser_id( 0, $id)->count();
        $unAuditOrder = Order::whereStatusAndUser_id(1, $id)->count();
        $auditOrder = Order::whereStatusAndUser_id(2, $id)->count();
        return [$submitAuditOrder, $unAuditOrder, $auditOrder];
    }

    public static function meOrderLog($id)
    {
        $submitAuditOrder = Order::whereStart_idAndStatusAndUser_id($id, 0, $id)->count();
        $unAuditOrder = Order::whereStart_idAndStatusAndUser_id($id, 1, $id)->count();
        $auditOrder = Order::whereStatusAndStart_idAndUser_id(2, $id, $id)->count();
        return [$submitAuditOrder, $unAuditOrder, $auditOrder];
    }
}