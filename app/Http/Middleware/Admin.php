<?php

namespace App\Http\Middleware;

use Closure,
    Illuminate\Contracts\Auth\Factory as Auth;

use Illuminate\Support\Facades\Cache;

class Admin
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

        $key = $_COOKIE['adminAccessToken'] ?? 'null';
        if (!Cache::has($key)) {
            return response()->json(['status' => 401]);
        } else {
            $cacheData = Cache::get($key);
            if (!$cacheData) {
                return response()->json(['status' => 401]);
            }
        }

        return $next($request);
    }

    public function delCookie()
    {
        setcookie('UserCookie', '', time() + 10, '/');
    }
}
