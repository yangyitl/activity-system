<?php

/*
|--------------------------------------------------------------------------
| Back Manage Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/


$router->group(
    [
        'namespace' => 'Admin',
        'prefix'    => MAN_PREFIX
    ],
    function () use ($router) {

        // index show data
        $router->get('index', ['as' => 'ManAdminIndexIndex', 'uses' => 'IndexController@index']);

        // login
        $router->post('/login', ['as' => 'ManAdminLogin', 'uses' => 'LoginController@Login']);
        // logout
        $router->get('/logout', ['as' => 'ManAdminLogout', 'uses' => 'LoginController@logout']);


    }
);


$router->group(
    [
        'namespace'  => 'Admin',
        'prefix'     => MAN_PREFIX,
        'middleware' => 'admin'
    ],
    function () use ($router) {


        // user
        $router->group(['prefix' => 'Users'], function () use ($router) {

            // user lists
            $router->post('lists', ['as' => 'ManAdminUsersLists', 'uses' => 'UsersController@lists']);
            // user edit
            $router->post('edit', ['as' => 'ManAdminUsersEdit', 'uses' => 'UsersController@edit']);
            // user add
            $router->post('add', ['as' => 'ManAdminUsersAdd', 'uses' => 'UsersController@add']);
            // user del
            $router->post('del', ['as' => 'ManAdminUsersDel', 'uses' => 'UsersController@del']);

        });


        // order
        $router->group(['prefix' => 'Order'], function () use ($router) {

            // order lists
            $router->post('lists', ['as' => 'ManAdminOrderLists', 'uses' => 'OrderController@lists']);
            // order edit
            $router->post('edit', ['as' => 'ManAdminOrderEdit', 'uses' => 'OrderController@edit']);
            // export order lists
            $router->get('toExcel', ['as' => 'ManAdminOrderToExcel', 'uses' => 'OrderController@toExcel']);

            $router->get('toExcelUser', ['as' => 'ManAdminOrderToExcelUser', 'uses' => 'OrderController@toExcelUser']);

        });


        // number
        $router->group(['prefix' => 'Number'], function () use ($router) {

            // number lists
            $router->post('lists', ['as' => 'ManAdminNumberLists', 'uses' => 'NumberController@lists']);
            // update number
            $router->post('edit', ['as' => 'ManAdminNumberEdit', 'uses' => 'NumberController@edit']);
            // insert number
            $router->post('add', ['as' => 'ManAdminNumberAdd', 'uses' => 'NumberController@add']);
            $router->post('del', ['as' => 'ManAdminNumberAdd', 'uses' => 'NumberController@del']);

        });

        // setting
        $router->group(['prefix' => 'Setting'], function () use ($router) {

            // setting lists
            $router->post('lists', ['as' => 'ManAdminSettingLists', 'uses' => 'SettingController@lists']);
            // update setting
            $router->post('edit', ['as' => 'ManAdminSettingEdit', 'uses' => 'SettingController@edit']);
            // insert setting
            $router->post('add', ['as' => 'ManAdminSettingAdd', 'uses' => 'SettingController@add']);

        });

        // sql
        $router->group(['prefix' => 'Sql'], function () use ($router) {

            // sql lists
            $router->post('lists', ['as' => 'ManAdminSqlLists', 'uses' => 'SqlController@lists']);
            // sql edit
            $router->get('downloadFiles', ['as' => 'ManAdminSqlDownloadFiles', 'uses' => 'SqlController@downloadFiles']);

        });
    }
);