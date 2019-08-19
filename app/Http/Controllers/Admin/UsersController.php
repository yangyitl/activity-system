<?php

/**
 * * * * * *
 * 用户管理 *
 * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-23
 * Time: 12:27
 */

namespace App\Http\Controllers\Admin;

use App\Http\Model\Order;
use App\Http\Model\Users;

class UsersController extends AdminController
{


    /**
     *  查询处理数据
     *
     * @return array
     */
    public function map()
    {

        $name    = self::$parameter->name ?? false;
        $account = self::$parameter->account ?? false;

        $map[] = ['id', '>', 0];
        if ($name) {
            $map[] = ['name', 'like', '%' . $name . '%'];
        }
        if ($account) {
            $map[] = ['account', '=', $account];
        }

        return $map;


    }


    /**
     *  修改处理数据
     *
     * @return array|bool
     */
    public function editArr()
    {

        $status = self::$parameter->status ?? false;

        if ($status !== false) {
            $update = [
                'status'     => $status,
                'updated_at' => self::$today
            ];

            return $update;
        } else {
            return false;
        }
    }


    /**
     *  修改处理数据
     *
     * @return array|bool
     */
    public function addArr()
    {

        $name    = self::$parameter->name ?? false;
        $account = self::$parameter->account ?? false;

        if ($account && $name) {
            $checkReg = Users::whereAccount($account)->count();
            if ($checkReg) {
                self::returnJson([], 400, '该手机号已注册!');
            } else {
                $pass   = rand(100000, 999999);
                $insert = [
                    'name'       => $name,
                    'account'    => $account,
                    'status'     => 0,
                    'pass'       => md5($pass),
                    'clear_pass' => $pass,
                    'add_time'   => time(),
                    'created_at' => self::$today,
                    'updated_at' => self::$today
                ];

                return $insert;
            }
        } else {
            return false;
        }

    }


    /**
     * 删除用户前置校验方法
     *
     * @param $id
     */
    public function delMethod($id)
    {

        $check = Order::whereUser_id($id)->count();
        if ($check) {
            self::returnJson([], 400, '该用户已产生订单,不能删除!');
        }

    }

//    public function postMethod($lists)
//    {
//
//        foreach ($lists as &$val) {
//            $log = Users::order($val['id']);
//         //   var_dump($log);
//            $val['me_order'] = $log['meOrder'];
//            $val['sub_order'] = $log['unOrder'];
//        }
//        return $lists;
//    }

}