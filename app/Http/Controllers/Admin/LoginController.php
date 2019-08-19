<?php

/**
 * * * * *
 *  登录  *
 * * * * *
 *
 * Created by PhpStorm.
 * User: xiezicheng
 * Date: 2019-03-20
 * Time: 23:20
 */

namespace App\Http\Controllers\Admin;

use App\Http\Model\Admin;

use Illuminate\Support\Facades\Cache;

class LoginController extends AdminController
{


    /**
     *  登录
     */
    public function login()
    {

        $account  = self::$parameter->account ?? '';
        $password = self::$parameter->password ?? '';

        $status       = 400;
        $checkAccount = Admin::whereAccount($account)->count();
        if (!$checkAccount) {
            $msg = '账户不存在!';
        } else {
            $admin = Admin::whereAccount($account)
                ->first();
            self::initArray($admin);

            if ($admin->password == $password) {
                $key = md5($password . time());
                Cache::put($key, $admin, 7200);
                setcookie('adminAccessToken', $key, time() + 7200, '/');
                $status = 200;
                $msg    = '登录成功!';
            } else {
                $msg = '密码错误!';
            }
        }

        self::returnJson('', $status, $msg);


    }


    /**
     * 退出登录
     */
    public function logout()
    {

        setcookie('adminAccessToken', '', 7200, '/');

        self::returnJson([], 200, '退出成功!');

    }
}