<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Model\Users;
use App\Http\Model\Sms;
use Illuminate\Support\Facades\Cache;

class LoginController extends Controller
{
    public static function login()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
        ];
        $rules = [
            'account' => ['required|numeric|digits:11', '手机号'],
            'pass' => ['required', '密码'],
        ];
        self::Validator($rules, $message);

        $user = Users::whereAccount(self::$parameter->account)->select('id', 'pass', 'clear_pass', 'status')->first();
        if ($user) {
            if ($user['status']) {
                self::returnJson([], 400, '用户状态冻结');
            }
            if ($user['clear_pass'] == self::$parameter->pass) {
                $up = [
                    'last_ip' => self::$request->ip(),
                    'last_time' => self::$request->ip(),
                    'up_time' => time()
                ];
                Users::whereId($user['id'])->update($up);
                $cache = [
                    'userId' => $user['id'],
                    'timestamp' => time(),
                ];
                $cache = json_decode(json_encode($cache));
                $md = md5(self::$parameter->account . self::$parameter->pass);
                Cache::put($md, $cache, 7 * 86400);
                setcookie('UserCookie', $md, time() + 7 * 86400, "/");
                self::returnJson();
            }
            self::returnJson([], 400, '密码不正确');
        }
        self::returnJson([], 400, '账号不存在');
    }

    public static function check()
    {
        if (!isset($_COOKIE['UserCookie']) || !$_COOKIE['UserCookie']
            || !Cache::has($_COOKIE['UserCookie'])) {
            return response(['status' => 400]);
        }
        return response(['status' => 200]);
    }

    public static function forgot()
    {
        $message = [
            'required' => ':attribute不能为空。',
            'numeric' => ':attribute为数字。',
            'digits' => ':attribute为数字。',
        ];
        $rules = [
            'account' => ['required|numeric|digits:11', '手机号'],
        ];
        self::Validator($rules, $message);

        $user = Users::whereAccount(self::$parameter->account)->select('id', 'pass', 'clear_pass', 'status')->first();
        if ($user) {
            if ($user['status']) {
                self::returnJson([], 400, '用户状态冻结');
            }
            $pass = rand(100000, 999999);
            $data = Sms::sendVerify(self::$parameter->account, $pass, 'pass');
            if ($data === true) {
                $up = [
                    'clear_pass' => $pass,
                    'pass' => md5($pass),
                    'up_time' => time()
                ];
                Users::whereId($user['id'])->update($up);
                self::returnJson([], 200, '获取动态密码成功，请注意查看短信');
            } elseif(is_string($data)){
                self::returnJson([], 400, $data);
            } else {
                self::returnJson([], 400, '系统繁忙，请联系客服');
            }
        }
        self::returnJson([], 400, '账号不存在');
    }

}
