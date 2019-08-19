<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/


/**
 * 无中间件过滤'middleware' => 'userLogin',
 */

$router->group(['prefix' => USE_PREFIX, 'namespace' => 'User', 'middleware' => 'userLogin',],
    function () use ($router) {
        $router->post('login', ['as' => 'useLogin', 'uses' => 'LoginController@login']);
        $router->post('forgot', ['as' => 'useForgot', 'uses' => 'LoginController@forgot']);
        //检查
        $router->post('check/login', ['uses' => 'LoginController@check']);
    });
/**
 * 中间件过滤
 */
$router->group(['prefix' => USE_PREFIX, 'middleware' => 'auth', 'namespace' => 'User'],
    function () use ($router) {

        //首页
        $router->get('index', ['uses' => 'UserController@index']);
        //添加经销商
        $router->post('add/agent', ['uses' => 'AgentController@add']);
        //退出
        $router->post('logout', ['uses' => 'UserController@logout']);
        //获取订单规格
        $router->post('order/num', ['uses' => 'OrderController@number']);
        //添加订单
        $router->post('order/add', ['uses' => 'OrderController@add']);
        //自己订单中心
        $router->post('order/mlist', ['uses' => 'OrderController@meList']);
        //获取单个订单
        $router->post('order/item', ['uses' => 'OrderController@item']);
        //修改订单
        $router->post('order/edit', ['uses' => 'OrderController@edit']);
        //经销商
        $router->post('dealers/list', ['uses' => 'AgentController@lists']);
        //经销商订单中心
        $router->post('order/dlist', ['uses' => 'OrderController@dealersList']);
        //个人中心
        $router->post('user/index', ['uses' => 'UserController@index']);
        //动态密码
        $router->post('user/pass', ['uses' => 'UserController@pass']);
        //确认动态密码
        $router->post('user/rpass', ['uses' => 'UserController@rpass']);
        //修改密码
        $router->post('user/epass', ['uses' => 'UserController@epass']);
        //提交订单
        $router->post('dealers/submit', ['uses' => 'AgentController@submit']);
        //公告
        $router->post('dealers/mgr', ['uses' => 'AgentController@mgr']);
        //单个提交订单
        $router->post('order/submit', ['uses' => 'OrderController@submit']);
        //下级提交审核
        $router->post('order/sub', ['uses' => 'OrderController@subSubmit']);
        //批量提交订单
        $router->post('order/asubmit', ['uses' => 'OrderController@allSubmit']);
        //计算订单
        $router->post('order/sum', ['uses' => 'OrderController@sum']);
        //检查订单
        $router->post('order/check', ['uses' => 'OrderController@check']);
        //关闭订单
        $router->post('order/del', ['uses' => 'OrderController@del']);
        //智能识别地址
        $router->post('order/addr', ['uses' => 'OrderController@addr']);
    });
