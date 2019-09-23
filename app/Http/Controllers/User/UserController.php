<?php

namespace App\Http\Controllers\User;

use App\Http\Model\Order;
use App\Http\Model\Setting;
use App\Http\Model\UserLog;
use App\Http\Model\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UserController extends BasisController
{

    public static function index()
    {
        //我的订单
        $meOrder = Order::whereStart_idAndUser_id(self::$userId, self::$userId)->where('pstatus', '>=', 2)->count();
        $meNum = Order::whereStart_idAndUser_id(self::$userId, self::$userId)->where('pstatus', '>=', 2)->sum('number');
//        var_dump(self::$userId );

        //经销商订单
        $map = [
            ['start_id', '!=', self::$userId],
            ['pid', '=', self::$userId],
            ['pstatus', '=', 3]
        ];
        $subOrder = Order::where($map)->whereStatus(2)->groupBy('order_sn')->get()->toArray();
        $subNum = 0;
        foreach ($subOrder as $value) {
            $subNum += $value['number'];
        }
        $subOrder = count($subOrder);
        //$subNum = Order::where($map)->whereStatus(2)->sum('number');


        //未审核订单

        //自己的订单
        $map = [
            ['status', '=', 0],
            ['user_id', '=', self::$userId],
            ['start_id', '=', self::$userId],
        ];
        $unOrder1 = Order::where($map)->count();
        $unNum1 = Order::where($map)->sum('number');

        $unOrder1 += Order::whereStart_idAndUser_idAndPstatus(self::$userId, self::$userId, 1)->count();
        $unNum1 += Order::whereStart_idAndUser_idAndPstatus(self::$userId, self::$userId,
            1)->sum('number');
        $orMap = [
            ['pstatus', '>=', 1],
            ['pstatus', '<', 3],
            ['pid', '=', self::$userId],
            ['start_id', '!=', self::$userId],
        ];
        $unOrder = Order::where($orMap)->groupBy('order_sn')->get()->toArray();
        $unNum = 0;
        foreach ($unOrder as $value) {
            $unNum += $value['number'];
        }
        $unOrder = count($unOrder);
        $unOrder += $unOrder1;
        $unNum += $unNum1;

        $map = [
            ['pstatus', '>', 0],
            ['pid', '=', self::$userId],
        ];

        $orMap = [
            ['status', '!=', -1],
            ['start_id', '=', self::$userId],
        ];
        $unAOrder = Order::where($map)->groupBy('order_sn')->get()->toArray();
        $unAOrder = count($unAOrder);

        $unAOrder1 = Order::where($orMap)->groupBy('order_sn')->get()->toArray();

        $unAOrder += count($unAOrder1);
        $unANum = 0;
        $log = Order::where($map)->groupBy('order_sn')->get()->toArray();
        foreach ($log as $val) {
            $unANum += $val['number'];
        }
        $unAOrder1 = Order::where($orMap)->groupBy('order_sn')->get()->toArray();
        foreach ($unAOrder1 as $val) {
            $unANum += $val['number'];
        }

        $map[] = ['start_id', '=', 'user_id'];
        $total = Order::where($map)->count();
        //self::initArray($log, 'array');

        $number = Setting::where('key','=','INVENTORY')->value('data');
        if ($number<= 0 ){
            $number ='已售罄';
        }
        $data = [
            'meNum' => $meNum,
            'meOrder' => $meOrder,
            'subOrder' => $subOrder,
            'subNum' => $subNum,
            'unOrder' => $unOrder,
            'unNum' => $unNum,
            'totalOrder' => $unAOrder,
            'totalNum' => $unANum,
            'total' => $total,
            'name' => self::$userData->name,
            'number' => $number
        ];
        self::returnJson($data);
    }

    public static function logout()
    {
        setcookie('UserCookie', '', time() + 1, "/");
        self::returnJson();
    }

    public static function addSub()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
        ];
        $rules = [
            'account' => ['required|numeric|digits:11', '手机号'],
            'name' => ['required', '姓名'],
        ];
        self::Validator($rules, $message);

        $pass = rand(100000, 999999);
        $relation = self::$userData['relation'] ? self::$userData['relation'] . ',' . self::$userId : self::$userId;
        $in = [
            'account' => self::$parameter->account,
            'name' => self::$parameter->name,
            'pid' => self::$userId,
            'pname' => self::$userData['name'],
            'pass' => md5($pass),
            'clear_pass' => $pass,
            'relation' => $relation,
            'last_ip' => '0.0.0.0',
            'add_time' => time(),
            'up_time' => time(),
            'updated_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];
        $id = Users::insertgetId($in);
        if ($id) {
            $in['id'] = $id;
            Users::afterAdd($in, self::$recursive);
            $re = [
                'pass' => $pass,
            ];
            self::returnJson($re);
        }
        self::returnJson([], '400', '系统繁忙userInSql');
    }


    public static function epass()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
        ];
        $rules = [
            'oldPass' => ['required', '当前密码'],
            'newPass' => ['required', '新密码'],
        ];
        self::Validator($rules, $message);
        if (self::$userData->clear_pass == self::$parameter->oldPass) {
            $up = [
                'pass' => md5(self::$parameter->newPass),
                'clear_pass' => self::$parameter->newPass

            ];
            $stats = Users::whereId(self::$userId)->update($up);
            if ($stats) {
                self::returnJson();
            }

            self::returnJson([], '400', '系统繁忙userEdPassSql');
        }
        self::returnJson([], 400, '请输入正确当前密码');
    }

}
