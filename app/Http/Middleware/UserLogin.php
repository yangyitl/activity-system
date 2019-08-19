<?php

namespace App\Http\Middleware;

use Closure,
    Illuminate\Contracts\Auth\Factory as Auth,
    App\Http\Model\Setting;
use Illuminate\Support\Facades\Cache;

class UserLogin
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
     * @param  \Illuminate\Contracts\Auth\Factory $auth
     * @return void
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param  string|null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {

        $activity = Setting::whereId(1)->first();

        if (!$activity) {
            $this->delCookie();
            return response(['status' => 400, 'msg' => '活动已结束']);

        }
        if ($activity['stime'] > time() || $activity['etime'] < time()) {
            $this->delCookie();
            return response(['status' => 400, 'msg' => '活动已结束']);

        }


        return $next($request);
    }

    public function delCookie()
    {
        setcookie('UserCookie', '', time() + 10, '/');
    }
}
