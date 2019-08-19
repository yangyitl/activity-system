<?php

namespace App\Http\Controllers\User;

use App\Http\Model\Number;
use App\Http\Model\Order;
use App\Http\Model\Setting;
use App\Http\Model\Users;
use Illuminate\Support\Facades\Cache;

class OrderController extends BasisController
{

    /**
     * 获取商品规格
     */
    public static function number()
    {
        // self::returnJson([], 400, '活动已结束');
        $list = Number::orderBy('sort', 'Asc')->get()->toArray();
        self::returnJson($list);
    }

    /**
     * 添加订单
     * @throws \App\Http\Model\ExcException
     */
    public static function add()
    {

        $activity = Setting::whereId(1)->first();
        if ($activity['stime'] > time() || $activity['etime'] < time()) {
            return response(['status' => 401, 'msg' => '活动已结束']);
        }

        $number = 0;
        $rs = Setting::where('key', '=', 'INVENTORY')->first();
		if (!is_null($rs)) {
        	$number = $rs->data;
        }
        if ($number<=0){
            return response(['status' => 401, 'msg' => '库存已空']);
        }

        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
        ];
        $rules = [
            'mobile' => ['required|numeric|digits:11', '手机号'],
            'name' => ['required', '姓名'],
            'num' => ['required|numeric', '数量'],
            'addr' => ['required', '详细地址'],
            'city' => ['required', '省市区'],
        ];
        self::Validator($rules, $message);

        $number = Number::whereId(self::$parameter->num)->first();
        if (!$number) {
            self::returnJson([], 400, '选择正确的数量规格');
        }
        $number = $number['number'];
        $sn = date('YmdHis') . self::$userId . rand(100, 999);
        $city = explode(' ', self::$parameter->city);
        $add = [
            'order_sn' => $sn,
            'start_id' => self::$userId,
            'start_name' => self::$userData->name,
            'user_id' => self::$userId,
            'user_name' => self::$userData->name,
            'pid' => self::$userData->pid,
            'pname' => self::$userData->pname,
            'consignee' => self::$parameter->name,
            'mobile' => self::$parameter->mobile,
            'number_id' => self::$parameter->num,
            'number' => $number,
            'province' => isset($city[0]) ? $city[0] : '',
            'city' => isset($city[1]) ? $city[1] : '',
            'area' => isset($city[2]) ? $city[2] : '',
            'price' => 1990,
            'status' => 0,
            'total_amount' => $number * 1990,
            'address' => self::$parameter->addr,
            'add_time' => time(),
            'updated_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s'),
            'remark' => self::$parameter->remark,
        ];
        $id = Order::insertGetId($add);
        if ($id) {
//            Users::whereId(self::$userId)->increment('me_order');
//            if (self::$pid)
//                Users::whereId(self::$pid)->increment('sub_order');
//            self::addLog('[添加订单] ' . self::$userData->name . '添加'.$number.'瓶，总' . date('Y-m-d H:i'));

            self::inventory($number);
            self::returnJson();
        }
        self::returnJson([], '400', '系统繁忙orderInSql');
    }


    /**
     * 自己的订单中心
     * @throws \App\Http\Model\ExcException
     */
    public static function meList()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'p' => ['required|numeric', '页数'],
        ];
        self::Validator($rules, $message);

        $list['list'] = Order::whereStart_idAndUser_id(self::$userId, self::$userId)->orderBy('add_time', 'desc')
            ->offset((self::$parameter->p - 1) * 15)->limit(15)->get()->toArray();

        $list['listTotal'] = Order::whereStart_idAndUser_id(self::$userId, self::$userId)->count();
        self::returnJson($list);
    }


    /**
     * 获取单个订单记录
     * @throws \App\Http\Model\ExcException
     */
    public static function item()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'id' => ['required|numeric', '订单'],
        ];
        self::Validator($rules, $message);

        $item = Order::whereId(self::$parameter->id)->first();
        self::initArray($item, 'array');
        self::returnJson($item);
    }

    /**
     * @throws \App\Http\Model\ExcException
     */
    public static function edit()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'id' => ['required|numeric', '订单'],
        ];
        self::Validator($rules, $message);

        $item = Order::whereId(self::$parameter->id)->first();
        if ($item) {
            $city = explode(' ', self::$parameter->city);
            $up = [
                'consignee' => self::$parameter->name,
                'mobile' => self::$parameter->mobile,
                'province' => $city[0],
                'city' => $city[1],
                'area' => $city[2],
                'address' => self::$parameter->addr,
                'edit_time' => time(),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $stats = Order::whereId(self::$parameter->id)->update($up);
            if ($stats) {
                self::returnJson();
            } else {
                self::returnJson([], '400', '系统繁忙orderEdSql');
            }
        } else {
            self::returnJson([], 400, '订单不存在');
        }
    }

    /**
     * 经销商订单
     * @throws \App\Http\Model\ExcException
     */
    public static function dealersList()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
        ];
        $rules = [
            'id' => ['required|numeric', '订单'],
            'p' => ['required|numeric', '页数'],
            'status' => ['required|numeric', '状态'],
        ];
        self::Validator($rules, $message);
        $list['userId'] = self::$userId;

        if (self::$userId == self::$parameter->id) {
            //待提交
            $submitModel = Order::whereStart_idAndUser_id(self::$parameter->id, self::$parameter->id)
                ->where('status', '=', 0);

            //待审核
            $unModel = Order::whereStart_idAndUser_idAndPstatus(self::$parameter->id, self::$parameter->id, 1);
            //已审核
            $model = Order::whereStart_id(self::$parameter->id)->where('pstatus', '>=', 2);
            //列表
            if (self::$parameter->status == 0) {
                $listModel = Order::whereStart_idAndUser_id(self::$parameter->id, self::$parameter->id)
                    ->where('status', '<', 1);
            } elseif (self::$parameter->status == 1) {
                $listModel = Order::whereStart_idAndUser_idAndPstatus(self::$parameter->id, self::$parameter->id, 1);
            } else {
                $listModel = Order::whereStart_idAndUser_id(self::$parameter->id, self::$parameter->id)
                    ->where('pstatus', '>=', 2);
            }
        } else {

            //待提交
            $map = [
                ['user_id', '=', self::$parameter->id],
                ['pid', '=', self::$userId],
                ['pstatus', '=', 1],
                ['status', '=', 1],
            ];
            $submitModel = Order::where($map);

            //待审核
            $unMap = [
                ['user_id', '=', self::$parameter->id],
                ['pstatus', '=', 2],
                ['pid', '=', self::$userId],
            ];
            $unModel = Order::where($unMap);

            //已审核
            $map = [
                ['user_id', '=', self::$parameter->id],
                ['pstatus', '=', 3],
                ['status', '=', 2],
                ['pid', '=', self::$userId],
            ];
            $model = Order::where($map);

            //列表
            $map = [
                ['user_id', '=', self::$parameter->id],
                ['pid', '=', self::$userId],
                ['pstatus', '=', (self::$parameter->status + 1)],
            ];

            //列表
            if (self::$parameter->status == 1) {
                $map[] = ['status', '=', 2];
            } elseif (self::$parameter->status == 2) {
                $map[] = ['status', '=', 2];
            } else {
                $map[] = ['status', '=', 1];
            }


            $listModel = Order::where($map);

        }
        $name = Users::whereId(self::$parameter->id)->value('name');
        $list['totalMon'] = $list['totalNum'] = 0;

        $subLog = $model->groupBy('order_sn')->get()->toArray();
        foreach ($subLog as $k => $val) {
            $count = Order::whereOrder_snAndStatusAndPstatusAndPid($val['order_sn'], 2, 2, self::$userId)->count();
            if ($count) {
                unset($subLog[$k]);
            }
        }
        $list['sbu'] = count($subLog);

        $unlog = $unModel->groupBy('order_sn')->get()->toArray();
        $list['unSbu'] = count($unlog);
        $ublog = $unModel->groupBy('order_sn')->get()->toArray();
        $list['unSbu'] = count($ublog);

        $submitLog = $submitModel->groupBy('order_sn')->get()->toArray();
        foreach ($submitLog as $k => $val) {
            $count = Order::whereOrder_snAndStatusAndPstatusAndPid($val['order_sn'], 2, 2, self::$userId)->count();
            if ($count) {
                unset($submitLog[$k]);
            }
        }
        $list['submit'] = count($submitLog);

        if (self::$parameter->status == 2) {
            foreach ($subLog as $val) {
                $list['totalMon'] += $val['total_amount'];
                $list['totalNum'] += $val['number'];
            }
            $list['totalMon'] /= 100;
        } elseif (self::$parameter->status == 1) {
            foreach ($unlog as $val) {
                $list['totalMon'] += $val['total_amount'];
                $list['totalNum'] += $val['number'];
            }

            $list['totalMon'] /= 100;
        } else {
            foreach ($submitLog as $val) {
                $list['totalMon'] += $val['total_amount'];
                $list['totalNum'] += $val['number'];
            }
            $list['totalMon'] /= 100;
        }
        //列表数据
        $list['listTotal'] = count($listModel->groupBy('order_sn')->groupBy('id')->get()->toArray());
        $list['name'] = $name;
        $list['list'] = [];
        $arr2 = $listModel
            ->orderBy('add_time', 'desc')
//            ->offset((self::$parameter->p - 1) * 1000)
//            ->limit(1000)
            ->groupBy('order_sn')->groupBy('id')
            ->get()->toArray();
        $ids = [];


        foreach ($arr2 as $k => $item) {
            if (self::$parameter->status == 0) {
                $count = Order::whereOrder_snAndStatusAndPstatusAndPid($item['order_sn'], 2, 2, self::$userId)->count();
                if ($count) {
                    continue;
                }
            }
            if (self::$parameter->status == 2) {
                $count = Order::whereOrder_snAndStatusAndPstatusAndPid($val['order_sn'], 2, 2, self::$userId)->count();
                if ($count) {
                    continue;
                }
            }

            $item['created_at'] = date('Y-m-d H:i', strtotime($item['created_at']));
            $item['mobile'] = substr_replace($item['mobile'], '****', 3, 4);
            $list['list'][] = $item;
            $ids[] = $item['id'];

        }

        $list['ids'] = $ids;
        $path = app()->storagePath('logs/order/' . self::$parameter->id . date('Ymd') . '.log');
        @mkdir(dirname($path), 0755);
//        file_put_contents($path, date('Y-m-d H:i:s') .
//            json_encode($ids, JSON_UNESCAPED_UNICODE) . "\n",
//            FILE_APPEND);
        self::returnJson($list);
    }


    /**
     * 自己订单提交审核
     * @throws \App\Http\Model\ExcException
     */
    public static function submit()
    {
        self::returnJson([], 400, '请选中经销商订单');

    }


    /**
     * 单个订单提交
     * @throws \App\Http\Model\ExcException
     */
    public static function subSubmit()
    {
        self::returnJson([], 400, '请选中经销商订单');
    }


    /**
     * 计算订单金额
     */
    public static function sum()
    {
        $ids = explode(',', self::$parameter->ids);
//        var_dump(count(array_unique($ids)));
//
//        // 获取去掉重复数据的数组
//        $unique_arr = array_unique($ids);
//        // 获取重复数据的数组
//        $repeat_arr = array_diff_assoc($ids, $unique_arr);
//        var_dump($repeat_arr);

        $order = Order::whereIn('id', $ids)->groupBy('order_sn')->get()->toArray();//->sum('total_amount');
        $sum = 0;
//        var_dump(count($order));
        foreach ($order as $val) {
            if (!in_array($val['id'], $ids)) {
                var_dump($val['id']);
            }
            $sum += $val['total_amount'];
        }
        self::returnJson([
            'sum' => sprintf("%.2f", ($sum / 100)) . '元',
        ]);
    }


    /**
     * 批量订单提交
     * @throws \App\Http\Model\ExcException
     */
    public static function allSubmit()
    {
        $message = [
            'required' => ':attribute不能为空。',
        ];
        $rules = [
            'ids' => ['required', '订单'],
            'id' => ['required', '经销商'],
        ];
        self::Validator($rules, $message);
        $total = $number = $sum = 0;
        $ids = explode(',', self::$parameter->ids);
        if (self::$userId == self::$parameter->id) {
            $orders = Order::whereIn('id', $ids)->whereStatus(0)->get()->toArray();
            foreach ($orders as $val) {
                $sum += $val['number'];
            }
            if (self::$pid) {
                Order::whereIn('id', $ids)->whereStatus(0)->update(['status' => 1, 'pstatus' => 1]);
            } else {
                Order::whereIn('id', $ids)->whereStatus(0)->update(['status' => 2, 'pstatus' => 3]);
            }
        } else {
            $orders = Order::whereIn('id', $ids)->whereStatus(1)->get()->toArray();
            foreach ($orders as $val) {
                $sum += $val['number'];
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
            if ($number) {
                self::addLog(self::$parameter->id, self::$userId, $sum, $number, $total, '审核订单', 1);
            }
        }
        $number = count($orders);
        $total = $sum ? $sum * 19.9 : 0;
        if ($number) {
            self::addLog(self::$userId, self::$pid, $sum, $number, $total, '提交审核', 0);
        }

        self::returnJson();
    }


    public static function check()
    {
        $message = [
            'required' => ':attribute不能为空。',
        ];
        $rules = [
            'name' => ['required', '收货人'],
            'mobile' => ['required', '手机号'],
        ];
        self::Validator($rules, $message);

        $map = [
            ['consignee', '=', self::$parameter->name],
            ['mobile', '=', self::$parameter->mobile],
            ['start_id', '=', self::$userId],
        ];

        $count = Order::where($map)->first();
        if ($count) {
            self::initArray($count);
            self::returnJson($count);
        }
        self::returnJson([], 400, '没有重复订单');
    }


    public function del()
    {
        $message = [
            'required' => ':attribute不能为空。',
        ];
        $rules = [
            'id' => ['required', '订单号'],
        ];
        self::Validator($rules, $message);
        $number = Order::whereIdAndStatus(self::$parameter->id, 0)->value('number');
        if (!$number) {
            self::returnJson([], 400, '订单失效');
        }
        $stats = Order::whereId(self::$parameter->id)->update(['status' => -1]);
        if ($stats) {
            self::inventory($number, 1);
            self::returnJson();
        }

        self::returnJson([], 400, '订单失效');

    }


    public function addr()
    {
        $message = [
            'required' => ':attribute不能为空。',
        ];
        $rules = [
            'text' => ['required', '地址'],
        ];
        self::Validator($rules, $message);

        $app_id = 102878;
        $method = 'cloud.address.resolve';
        $api_key = '0b6c428acc4230b0d92dd6a87dc72deb96c6551b';
        $ts = time();
        $sign = md5($app_id . $method . $ts . $api_key);
        $host = "https://kop.kuaidihelp.com/api";
        $method = "POST";
        $headers = array();
        //根据API的要求，定义相对应的Content-Type
        array_push($headers, "Content-Type" . ":" . "application/x-www-form-urlencoded; charset=UTF-8");
        $querys = "";
        $bodys = [
            "app_id" => $app_id,
            "method" => 'cloud.address.resolve',
            "sign" => "$sign",
            "ts" => $ts,
            "data" => '{"text":"' . self::$parameter->text . '","multimode":false}'
        ];
        $bodys = http_build_query($bodys);
        $url = $host;
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_FAILONERROR, false);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        //curl_setopt($curl, CURLOPT_HEADER, true);
        if (1 == strpos("$" . $host, "https://")) {
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        }
        curl_setopt($curl, CURLOPT_POSTFIELDS, $bodys);
        $addr = (curl_exec($curl));
        curl_close($curl);
        $addr = json_decode($addr);
        if ($addr && $addr->code == 0) {
            $addr = $addr->data[0];

            $result['name'] = $addr->name;
            $result['address'] = $addr->province_name . ' ' . $addr->city_name . ' ' . $addr->county_name;
            $result['addr'] = $addr->detail;
            $result['phone'] = $addr->mobile;
            self::returnJson($result);
        }
        self::returnJson([], 400, '无法解析地址可能存在特殊符号');


    }

    function matchOne($str, $pattern)
    {
        if (preg_match($pattern, $str, $matches) > 0) {
            if (isset($matches[1])) {
                return $matches[1];
            }
        } else {
            return '';
        }
    }

}
