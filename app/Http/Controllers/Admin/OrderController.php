<?php

/**
 * * * * *
 *  订单 *
 * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-21
 * Time: 22:26
 */

namespace App\Http\Controllers\Admin;

use App\Http\Model\Order;
use App\Http\Model\Users;
use Maatwebsite\Excel\Facades\Excel;

class OrderController extends AdminController
{


    /**
     *  处理条件筛选
     *
     * @return array
     */
    public function map()
    {

        $province = self::$parameter->city ?? false;
        $city     = self::$parameter->agent_name ?? false;
        $name     = self::$parameter->oem_name ?? false;
        $sTime    = self::$parameter->stime ?? false;
        $eTime    = self::$parameter->etime ?? false;
        $type     = self::$parameter->type ?? 1;

        $map[] = ['id', '>', 0];
        if ($type > 1) {
            if ($type == 2) {
                $map[] = ['status', '=', 2];
            } elseif ($type == 3) {
                $map[] = ['status', '<', 2];
            }
        }
        if ($province) {
            $map[] = ['province', '=', $province];
        }
        if ($city) {
            $map[] = ['city', '=', $city];
        }
        if ($name) {
            $map[] = ['user_name', 'like', '%' . $name . '%'];
        }
        if ($sTime && $eTime) {
            if ($sTime == $eTime) {
                $date  = date('Y-m-d 00:00:00', $sTime);
                $times = strtotime($date);
                $map[] = ['add_time', '>=', $times];
                $map[] = ['add_time', '<=', $times + 86399];
            } else {
                $map[] = ['add_time', '>=', $sTime];
                $map[] = ['add_time', '<=', $eTime];
            }
        } else {
            $todayTime = strtotime(date('Y-m-d 00:00:00'));
            $map[]     = ['add_time', '>=', $todayTime];
            $map[]     = ['add_time', '<=', $todayTime + 86399];
        }

        return $map;

    }


    /**
     *  后置方法处理数据
     *
     * @param $data
     */
    public function postMethod(&$data)
    {

        if ($data) {
            foreach ($data as &$val) {
                $val['price']        = $this->decimal($val['price']);
                $val['total_amount'] = $this->decimal($val['total_amount']);

            }
            unset($val);
        }

    }

    public function editArr()
    {

        $name     = self::$parameter->name ?? '';
        $mobile   = self::$parameter->mobile ?? '';
        $province = self::$parameter->province ?? '';
        $city     = self::$parameter->city ?? '';
        $area     = self::$parameter->area ?? '';
        $address  = self::$parameter->address ?? '';

        if ($name && $mobile && $province && $city && $address && $area) {

            $edit = [
                'user_name' => $name,
                'mobile'    => $mobile,
                'province'  => $province,
                'city'      => $city,
                'area'      => $area,
                'address'   => $address
            ];

            return $edit;

        } else {
            return false;
        }


    }


    /**
     * 导出表格
     */
    public function toExcel()
    {
        ini_set('memory_limit', '1024M'); //设置程序运行的内存


        $sTime    = self::$parameter->sTime ?? 0;
        $eTime    = self::$parameter->eTime ?? 0;
        $province = self::$parameter->city ?? false;
        $city     = self::$parameter->agent_name ?? false;
        $name     = self::$parameter->oem_name ?? false;
        $type     = self::$parameter->type ?? false;

        if (!$sTime) {
            $sTime = strtotime(date('Y-m-d 00:00:00'));
        }
        if (!$eTime) {
            $eTime = strtotime(date('Y-m-d 23:59:59'));
        }
        if ($province) {
            $map[] = ['province', '=', $province];
        }
        if ($city) {
            $map[] = ['city', '=', $city];
        }
        if ($name) {
            $map[] = ['user_name', 'like', '%' . $name . '%'];
        }
        if ($type !== false) {
            if ($type == 2) {
                $map[] = ['status', '=', $type];
                $map[] = ['pstatus', '=', 3];
            } elseif ($type == 3) {
                $map[] = ['status', '>=', 0];
                $map[] = ['status', '<=', 1];
                $map[] = ['pstatus', '<', 3];
            }
        }
//        $map[] = ['pid', '=', 0];

        $export[] = [
            '仓库名称',
            '店铺名称',
            '发货条件',
            '原始单号',
            '订单编号',
            '收件人',
            '手机号',
            '省',
            '市',
            '区',
            '地址',
            '货品数量',
            '商家编码',
            '货品价格',
            '应收合计',
            '货品总价',
            '买家备注',
            '邮费',
            '优惠金额',
            '客服备注',
            '下单时间',
            '付款时间',
            '固话',
            '邮编',
            '网名',
            'COD买家费',
            '物流公司',
            '发票抬头',
            '发票内容',
            '支付方式',
            '业务员',
            '货品优惠',
            '源子订单号',
            '是否赠品',
            '预计结账时间',
            '备注',
            '订单类别',
            '证件号码'
        ];

        $map[] = ['add_time', '>=', $sTime];
        $map[] = ['add_time', '<=', $eTime];

        $lists = Order::where($map)->select(
            'order_sn',
            'consignee',
            'mobile',
            'province',
            'city',
            'area',
            'address',
            'number',
            'price',
            'total_amount',
            'created_at',
            'remark'
        )->groupby('order_sn')->get()->toArray();

        $number = count($lists);

        if ($number) {

            foreach ($lists as $val) {

                $export[] = [
                    '',
                    '',
                    '',
                    '',
                    $val['order_sn'] . ' ',
                    $val['consignee'],
                    $val['mobile'],
                    $val['province'],
                    $val['city'],
                    $val['area'],
                    $val['province'] . $val['city'] . $val['area'] . $val['address'],
                    $val['number'],
                    '',
                    $this->decimal($val['price']),
                    '',
                    $this->decimal($val['total_amount']),
                    $val['remark'],
                    '',
                    '',
                    '',
                    $val['created_at'],
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                ];
            }
            unset($val);
        }

        $sDate     = date('Y-m-d', $sTime);
        $eDate     = date('Y-m-d', $eTime);
        $tableName = $sDate . '-' . $eDate . '订单表格';       //预设表名

        Excel::create($tableName, function ($excel) use ($export) {
            $excel->sheet('score', function ($sheet) use ($export) {
                $sheet->rows($export);
            });
        })->export('xls');


    }

    public function toExcelUser()
    {

        ini_set('memory_limit', '1024M'); //设置程序运行的内存

//        $map[] = ['status', '>=', 0];
//        $map[] = ['status', '<=', 1];
        $map[] = ['pstatus', '<', 3];
        $map[] = ['id', '>', 0];

        $orderUser = Order::where($map)
            ->select(
                'user_id',
                'user_name'
            )->groupBy('user_id')
            ->get()->toArray();

//        var_dump($orderUser);
//        die;
        $export[] = [
            '姓名',
            '联系电话',
        ];

        if ($orderUser) {
            foreach ($orderUser as $value) {
                $mobile   = Users::whereId($value['user_id'])->value('account');
               // $orderNum = Order::where($map)->whereUser_id($value['user_id'])->count();
                $export[] = [
                    $value['user_name'],
                    $mobile . ' ',
                   // $orderNum
                ];
            }
            unset($value);
        }

        $tableName = '名下有未审核及未提交订单的用户-表格';       //预设表名

        Excel::create($tableName, function ($excel) use ($export) {
            $excel->sheet('score', function ($sheet) use ($export) {
                $sheet->rows($export);
            });
        })->export('xls');


    }


}