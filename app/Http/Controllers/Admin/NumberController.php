<?php

/**
 * * * * * * *
 * 设置售套餐 *
 * * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-23
 * Time: 15:40
 */

namespace App\Http\Controllers\Admin;

class NumberController extends AdminController
{


    public function map()
    {

        $name = self::$parameter->remark ?? false;
        if ($name) {
            $map[] = ['name', 'like', '%' . $name . '%'];
        } else {
            $map[] = ['id', '>', 0];
        }

        return $map;

    }


    public function editArr()
    {


        $number = self::$parameter->data ?? false;

        if ($number !== false) {
            $number = (int)$number;
            if ($number == 0) {
                self::returnJson([], 400, '请输入正确的数量！');
            } else {
                $edit = [
                    'number' => $number,
                    'updated_at' => self::$today
                ];
                return $edit;
            }
        } else {
            return false;
        }


    }

    public function addArr()
    {


        $name = self::$parameter->key ?? false;
        $number = self::$parameter->data ?? false;

        if ($name && $number) {
            $number = (int)$number;
            if ($number == 0) {
                self::returnJson([], 400, '请输入正确的数量！');
            } else {
                $add = [
                    'name' => $name,
                    'number' => $number,
                    'created_at' => self::$today,
                    'updated_at' => self::$today
                ];
                return $add;

            }
        } else {
            return false;
        }

    }


}