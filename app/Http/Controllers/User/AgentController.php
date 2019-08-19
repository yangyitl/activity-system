<?php

namespace App\Http\Controllers\User;

use App\Http\Model\Order;
use App\Http\Model\UserLog;
use App\Http\Model\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AgentController extends BasisController
{

    /**
     * 添加经销商
     * @throws \App\Http\Model\ExcException
     */
    public static function add()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
            'unique' => ':attribute已存在。',
        ];
        $rules = [
            'account' => ['required|numeric|digits:11|unique:users,account', '手机号'],
            'name' => ['required', '姓名'],
        ];
        self::Validator($rules, $message);

        $pass = rand(100000, 999999);
        $relation = self::$userData->relation ? self::$userData->relation . ',' . self::$userId : self::$userId;
        $in = [
            'account' => self::$parameter->account,
            'name' => self::$parameter->name,
            'pid' => self::$userId,
            'pname' => self::$userData->name,
            'pass' => md5($pass),
            'clear_pass' => $pass,
            'relation' => $relation,
            'last_ip' => '0.0.0.0',
            'add_time' => time(),
            'up_time' => time(),
            'updated_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];
        $id = Users::insertGetId($in);
        if ($id) {

            $in['id'] = $id;
            Users::afterAdd($in, self::$recursive);
            $cp = [

            ];
            $protocol = 'http://';
            if (self::isHttps() == true) {
                $protocol = 'https://';
            }
            $re = [
                'pass' => $pass,
                'cp' => "纪莱熙活动网站：\n" . $protocol . $_SERVER['HTTP_HOST'] . "/owner/#!/login" .
                    "\n" .
                    "\n登陆账号" . self::$parameter->account .
                    "\n密码" . $pass,
                'account' => self::$parameter->account
            ];
            self::returnJson($re);
        }
    }

    public static function lists()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'p' => ['required|numeric', '页数'],
        ];
        self::Validator($rules, $message);
        $list['list'] = [];

        if (self::$parameter->p == 1) {
            $item = Users::whereId(self::$userId)->first();
            self::initArray($item, 'array');
            $order = Order::meOrderLog(self::$userId);
            $item['submitAuditOrder'] = $order[0];
            $item['unAuditOrder'] = $order[1];
            $item['auditOrder'] = $order[2];
            $item['account'] = substr_replace($item['account'], '****', 3, 4);
            $list['list'][] = $item;
        }
        $model = Users::wherePid(self::$userId);
        if (isset(self::$parameter->keywords) && self::$parameter->keywords) {
            $key = self::$parameter->keywords;
            $model = $model->where('name', 'like', "%$key%");
        }

        $list['listTotal'] = $model->count();
        $list['listTotal'] += 1;
        $lists = $model
            ->offset((30 * (self::$parameter->p - 1)))
            ->limit(30)
            ->orderBy('add_time', 'desc')
            ->select()
            ->get()->toarray();

        foreach ($lists as $item) {
            $order = Order::orderLog($item['id'],self::$userId);
            $item['submitAuditOrder'] = $order[0];
            $item['unAuditOrder'] = $order[1];
            $item['auditOrder'] = $order[2];
            $item['account'] = substr_replace($item['account'], '****', 3, 4);
            $list['list'][] = $item;
        }
        $list['userId'] = self::$userId;
        self::returnJson($list);
    }

    public static function submit()
    {
        $goodsConfig = array_shift(config('goods'));
        $message = [
            'required' => ':attribute不能为空。',
        ];
        $rules = [
            'ids' => ['required', '经销商'],
        ];
        self::Validator($rules, $message);
        $ids = explode(',', self::$parameter->ids);
        if ($ids) {
            $total = $number = $sum = 0;
            foreach ($ids as $id) {
                $orderSum = 0;
                if ($id == self::$userId) {
                    $orders = Order::whereUser_id($id)->whereStatus(0)->get()->toArray();
                    foreach ($orders as $val) {
                        $orderSum += $val['number'];
                    }
                    if (self::$pid) {
                        Order::whereUser_id($id)->whereStatus(0)->update(['status' => 1, 'pstatus' => 1]);
                    } else {
                        Order::whereUser_id($id)->whereStatus(0)->update(['status' => 2, 'pstatus' => 3]);
                    }
                } else {
                    $orders = Order::whereUser_id($id)->whereStatus(1)->get()->toArray();
                    foreach ($orders as $val) {
                        $orderSum += $val['number'];
                        $oid = $val['id'];
                        unset($val['id']);
                        $val['user_id'] = self::$userId;
                        $val['user_name'] = self::$userData->name;
                        $val['pid'] = self::$userData->pid;
                        $val['pname'] = self::$userData->pname;
                        $val['add_time'] = time();
                        $val['updated_at'] = date('Y-m-d H:i:s');
                        $val['created_at'] = date('Y-m-d H:i:s');
                        if (self::$pid) {
                            $val['status'] = 1;
                            $val['pstatus'] = 1;
                        } else {
                            $val['status'] = 2;
                            $val['pstatus'] = 3;
                        }

                        $map = [
                            ['order_sn', '=', $val['order_sn']],
                            ['id', '<', $oid],
                        ];
                        Order::where($map)->update(['pstatus' => 3]);

                        if (self::$pid) {
                            Order::whereId($oid)->update(['status' => 2, 'pstatus' => 2]);
                        } else {
                            Order::whereId($oid)->update(['status' => 2, 'pstatus' => 3]);
                        }
                        $map = [
                            ['order_sn', '=', $val['order_sn']],
                            ['user_id', '=', $val['user_id']],
                        ];
                        $count = Order::where($map)->count();
                        if (!$count) {
                            Order::insert($val);
                        }

                    }
                }
                $orderNum = count($orders);
                $orderTotal = $orderSum ? $orderSum * $goodsConfig['goods_price'] : 0;
                $total += $orderTotal;
                $number += $orderNum;
                $sum += $orderSum;
                if ($id != self::$userId && $orderSum) {
                    self::addLog($id, self::$userId, $orderSum, $orderNum, $orderTotal, '审核订单', 1);
                }
            }
            if ($number) {
                self::addLog(self::$userId, self::$pid, $sum, $number, $total, '提交审核', 0);
            }

            self::returnJson();
        }
        self::returnJson([], 400, '请选中经销商订单');
    }

    public static function mgr()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'p' => ['required|numeric', '页数'],
        ];
        self::Validator($rules, $message);
        $map =[
            ['user_id','=',self::$userId],
            ['type','=',1]
        ];
        $omap =[
            ['pid','=',self::$userId],
            ['type','=',0]
        ];
        $log['list'] = UserLog::where($map)->Orwhere($omap)
            ->offset((30 * (self::$parameter->p - 1)))
            ->limit(30)->orderBy('add_time', 'desc')
            ->get()->toArray();

        foreach ($log['list'] as &$val) {
            if ($val['user_name'] == $val['pname']) {
                $val['user_name'] = Users::whereId($val['pid'])->value('name');
            }
            $val['add_time'] = date('d/m H:i', $val['add_time']);
        }

        $log['listTotal'] = UserLog::whereUser_id(self::$userId)->count();
        self::returnJson($log);
    }
}
