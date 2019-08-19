<?php

/**
 * * * * * *
 * 系统配置 *
 * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-21
 * Time: 22:55
 */

namespace App\Http\Controllers\Admin;

class SettingController extends AdminController
{


    /**
     *  处理搜索
     *
     * @return array
     */
    public function map()
    {

        $remark = self::$parameter->remark ?? false;

        if ($remark) {
            $map[] = ['remark', 'like', '%' . $remark . '%'];
        } else {
            $map[] = ['id', '>', 0];
        }

        return $map;


    }


    /**
     * 后置方法处理数据
     *
     * @param $data
     */
    public function postMethod(&$data)
    {

        if ($data) {
            foreach ($data as $key => $val) {
                if ($val['key'] == 'ACTIVITY') {
                    $data['sDate'] = date('Y-m-d', $val['stime'] + 80000);
                    $data['eDate'] = date('Y-m-d', $val['etime']);
                } else {
                    $data['number'] = $val['data'];
                }
                unset($data[$key]);
            }
        }


    }

    /**
     *  处理新增数据
     *
     * @return array|bool
     */
    public function addArr()
    {

        $key = self::$parameter->key ?? false;
        $data = self::$parameter->data ?? false;
        $remark = self::$parameter->remark ?? false;

        if ($key && $data && $remark) {
            $data = [
                'key' => $key,
                'data' => $data,
                'remark' => $remark,
                'created_at' => self::$today,
                'updated_at' => self::$today
            ];
            return $data;
        } else {
            return false;
        }


    }


    /**
     *  处理修改数据
     *
     * @return array|bool
     */
    public function editArr()
    {


        $sTime = self::$parameter->sTime ?? false;
        $eTime = self::$parameter->etime ?? false;
        if ($sTime && $eTime) {
            $dataArr = [
                'stime' => $sTime,
                'etime' => $eTime + 86399,
                'updated_at' => self::$today
            ];
            return $dataArr;
        } else {
            $number = self::$parameter->num ?? false;
            if ($number) {
                $dataArr = [
                    'data' => $number,
                ];
                return $dataArr;
            }
            return false;
        }


    }


}