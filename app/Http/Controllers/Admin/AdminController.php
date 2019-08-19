<?php

/**
 * * * * * * * * *
 *  后台管理基类  *
 * * * * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-20
 * Time: 23:17
 */

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminController extends Controller
{

    public static $model;
    public static $table;
    public static $today;


    /**
     * AdminController constructor.
     * @param Request $request
     */
    public function __construct(Request $request)
    {

        parent::__construct($request);

        $preg = '/\/man\/([a-zA-Z]{1,20})\//';
        preg_match($preg, $request->url(), $matches);
        self::$table = $matches[1] ?? 'nul';
        self::$model = '\App\Http\Model\\' . self:: $table;
        self::$today = date('Y-m-d H:i:s');


    }


    /**
     *  列表
     */
    public function lists()
    {

        $p      = self::$parameter->p ?? 1;
        $size   = self::$parameter->size ?? 15;
        $offset = $size * ($p - 1);

        $modePath = $this->getModelPath();
        if (file_exists($modePath)) {
            $map    = $this->map();
            $lists  = [];
            $model  = new self::$model;
            $number = $model->where($map)
                ->count();
            if ($number) {
                $lists = $model->where($map)
                    ->offset($offset)->limit($size)
                    ->orderBy('id', 'DESC')
                    ->get()->toArray();

                // 判断是否有后置方法 有则处理
                if (method_exists($this, 'postMethod')) {
                    $this->postMethod($lists);
                }
            }

            $result = [
                'lists'  => $lists,
                'number' => $number
            ];

            self::returnJson($result);
        } else {
            self::returnJson([], 400, '方法不存在');
        }

    }


    /**
     *  修改
     */
    public function edit()
    {

        $id = self::$parameter->id ?? 0;

        $msg = '发生错误啦!';
        if ($id) {
            $modePath = $this->getModelPath();

            if (file_exists($modePath)) {
                $model = new self::$model;
                // 判断是否有后置方法 有则处理
                if (method_exists($this, 'editArr')) {
                    $updateData = $this->editArr();
                    if ($updateData) {
                        $edit = $model->whereId($id)->update($updateData);
                        if ($edit) {
                            self::returnJson([], 200, '修改成功!');
                        } else {
                            $msg = '修改失败!';
                        }
                    } else {
                        $msg = '参数缺失2';
                    }
                } else {
                    $msg = '方法不存在';
                }
            } else {
                $msg = '方法不存在';
            }
        } else {
            $msg = '参数缺失1';
        }
        self::returnJson([], 400, $msg);

    }


    /**
     *  删除
     */
    public function del()
    {

        $id = self::$parameter->id ?? 0;

        $msg = '发生错误啦!';
        if ($id) {
            $modePath = $this->getModelPath();
            if (file_exists($modePath)) {
                $model = new self::$model;
                if (method_exists($this, 'delMethod')) {
                    $this->delMethod($id);
                }
                $del = $model->whereId($id)->delete();
                if ($del) {
                    self::returnJson([], 200, '删除成功!');
                } else {
                    $msg = '删除失败!';
                }
            } else {
                $msg = '方法不存在';
            }
        } else {
            $msg = '参数缺失';
        }
        self::returnJson([], 400, $msg);

    }


    /**
     *  新增
     */
    public function add()
    {

        $msg      = '发生错误啦!';
        $modePath = $this->getModelPath();
        if (file_exists($modePath)) {
            $model = new self::$model;
            if (method_exists($this, 'addArr')) {
                $insertData = $this->addArr();
                if ($insertData) {
                    $id = $model->insertGetId($insertData);
                    if ($id) {
                        self::returnJson([], 200, '新增成功!');
                    } else {
                        $msg = '新增失败!';
                    }
                } else {
                    $msg = '参数缺失!';
                }
            } else {
                $msg = '方法不存在';
            }
        } else {
            $msg = '方法不存在';
        }

        self::returnJson([], 400, $msg);

    }


    /**
     *  筛选条件
     *
     * @return array
     */
    public function map()
    {

        return [['id', '>', 0]];

    }


    /**
     *  强制转换成 2 位小数
     *
     * @param $number
     * @param int $num
     * @return string
     */
    protected function decimal($number, $num = 2)
    {

        $result = sprintf("%.{$num}f", $number / 100);

        return $result;


    }


    private function getModelPath()
    {

        $path = app()->basePath() . '/app/Http/Model/' . self::$table . '.php';

        return $path;

    }

}