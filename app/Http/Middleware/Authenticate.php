<?php

namespace App\Http\Middleware;

use Closure,
    Illuminate\Contracts\Auth\Factory as Auth,
    App\Http\Model\Setting;
use Illuminate\Support\Facades\Cache;

class Authenticate
{
    /**
     * The authentication guard factory instance.
     *
     * @var \Illuminate\Contracts\Auth\Factory
     */
    protected $auth;

    /**
     * Create a new middleware instance.
     *
     * @param \Illuminate\Contracts\Auth\Factory $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {

        if (!isset($_COOKIE['UserCookie']) || !$_COOKIE['UserCookie']
            || !Cache::has($_COOKIE['UserCookie'])) {
            $this->delCookie();
            return response(['status' => 401]);
        }
//        $cache = Cache::get($_COOKIE['UserCookie']);
//        if ($cache->userId != 1 && $cache->userId != 103 &&
//            $cache->userId != 104 && $cache->userId != 105
//            && $cache->userId != 106 && $cache->userId != 107
//            && $cache->userId != 115&& $cache->userId != 116
//            && $cache->userId != 119 && $cache->userId != 120 ) {
//            $this->delCookie();
//            return response(['status' => 401, 'msg' => '系统维护中']);
//        }
        return $next($request);
    }

    public function delCookie()
    {
        setcookie('UserCookie', '', time() + 10, '/');
    }
}
