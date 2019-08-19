<?php

/**
 * * * * * * *
 * 数据库备份 *
 * * * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-29
 * Time: 18:47
 */

namespace App\Http\Controllers\Admin;

class SqlController extends AdminController
{


    /**
     *  备份列表
     */
    public function lists()
    {


        $p = self::$parameter->p ?? 1;
        $size = self::$parameter->size ?? 15;
        $offset = ($p - 1) * $size;

        $files = scandir('/home/back_up_db/md_dealers/');

        $number = count($files);
        $lists = [];
        if ($number) {
            $files = array_slice($files, 2);
            $number = count($files);
            $files = array_reverse($files);
            if ($number) {
                foreach ($files as $k => $val) {
                    $lists[] = [
                        'id' => $k,
                        'name' => $val
                    ];
                }
                unset($val);
                $lists = array_slice($lists, $offset, $size);
            }
        }

        $result = [
            'lists' => $lists,
            'number' => $number
        ];

        self::returnJson($result, 200, '获取成功');


    }


    /**
     *   下载数据库备份
     */
    public function downloadFiles()
    {

        $name = self::$parameter->name ?? urlencode('md_back_20190328.sql');
        $name = urldecode($name);
        //文件路径（路径+文件名）
        $file_name = '/home/back_up_db/md_dealers/' . $name;
        // required
        header('Pragma: public');
        //no cache
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Cache-Control: private', false);
        //强制下载
        header('Content-Type:application/force-download');
        header('Content-Disposition: attachment; filename="' . basename($file_name) . '"');
        header('Content-Transfer-Encoding: binary');
        header('Connection: close');
        //输出到浏览器
        readfile($file_name);

        exit();


    }


}