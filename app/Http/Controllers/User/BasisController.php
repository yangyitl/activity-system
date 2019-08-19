<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Model\Setting;
use App\Http\Model\UserLog;
use App\Http\Model\Users;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class BasisController extends Controller
{
    public static $cache;
    public static $userId;
    public static $userData;
    public static $pid;
    public static $recursive;

    public function __construct(Request $request)
    {
        parent::__construct($request);
        $cache = false;
        if (isset($_COOKIE['UserCookie'])) {
            $cache = Cache::get($_COOKIE['UserCookie']);
        }
        if ($cache) {
            self::$userId = $cache->userId;

            $user = Users::whereId(self::$userId)->first();
            if ($user && !$user['status']) {
                self::initArray($user);
                self::$userData = $user;
                self::$pid = self::$userData->pid;
                self::recursive(self::$recursive);
            } else {
                exit(json_encode(['status' => 401, 'msg' => '账号不存在或者已被冻结']));
            }
        } else {
            exit(json_encode(['status' => 401]));
        }
    }

    public static function recursive(&$extends)
    {
//        var_dump(self::$userData->relation);
        $extends = Cache::get('UserExtends_' . self::$userId);
        if (!$extends) {
            $extends = [];
            if (self::$userData->relation != '0') {
                $extends = Users::recursive(self::$userData->relation);
            }
            $extends[] = ['id' => self::$userId, 'name' => self::$userData->name];
            Cache::put('UserExtends_' . self::$userId, $extends, 60);

        }
    }


    public static function addLog($id, $pid, $orderSum, $orderNum, $orderTotal, $remark, $type)
    {
//        var_dump($id);
        $user = Users::whereId($id)->value('name');
        $puser = Users::whereId($pid)->value('name');
        $add = [
            'remark' => $remark,
            'user_id' => $id,
            'user_name' => $user ? $user : '董事',
            'pid' => $pid,
            'pname' => $puser ? $puser : '董事',
            'number' => $orderNum,
            'sum' => $orderSum,
            'total' => $orderTotal * 100,
            'type' => $type,
            'add_time' => time(),
            'updated_at' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        ];
        UserLog::insertGetId($add);
    }

    public static function inventory($number, $type = 0)
    {
        if ($type) {
            Setting::where('key', '=', 'INVENTORY')->increment('data', $number);
        } else {
            Setting::where('key', '=', 'INVENTORY')->decrement('data', $number);
        }
    }

    protected static function isHttps() {
        if ( !empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') {
            return true;
        } elseif ( isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https' ) {
            return true;
        } elseif ( !empty($_SERVER['HTTP_FRONT_END_HTTPS']) && strtolower($_SERVER['HTTP_FRONT_END_HTTPS']) !== 'off') {
            return true;
        }
        return false;
    }
}
