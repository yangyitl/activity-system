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

const MAN_PREFIX = 'man/';
const USE_PREFIX = 'use/';
const COM_PREFIX = 'com/';
//根目录
$router->get('/', function () {
    return redirect('./owner/index.html');
});

$router->get('order', ['as' => 'order', 'uses' => 'Controller@order']);

$router->group(['prefix' => COM_PREFIX], function () use ($router) {
    //公共登陆
    $router->post('login', ['as' => 'Login', 'uses' => 'Controller@Login']);
    //公共退出
    $router->get('logout', ['as' => 'ManLogout', 'uses' => 'Controller@logout']);
    //上传图片
    $router->post('upload', ['as' => 'imgUpload', 'uses' => 'Controller@imgUpload']);
});


require_once 'userWeb.php';
require_once 'manWeb.php';