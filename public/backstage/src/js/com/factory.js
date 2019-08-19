(function () {
    'use strict';
    var app = angular.module('zm');
    //http request
    app.factory('request', function ($http, $state, $rootPath, spinner, pop) {
        var request = function (options) {
            if (Object.prototype.toString.call(options) === '[object Object]') {
                $http({
                    method: options.type || 'POST',
                    url: options.url || '',
                    data: options.data || {},

                }).then(function (res) {
                    var status = res.data.status;
                    if (options.hideSpinner || typeof options.hideSpinner == 'undefined') spinner.hide();
                    if (status) {
                        if (status == 200) {
                            options.ok ? options.ok(res.data) : console.warn('Missed successful handler');

                        } else if (status == 400) {
                            options.fail ? options.fail(res.data) : pop.usual({
                                title: '温馨提示',
                                msg: res.data.msg
                            });

                        } else if (status == 401) {
                            pop.usual({
                                title: '温馨提示',
                                msg: '登录已失效，请重新登录',
                                handler: function (res) {
                                    $state.go('login');
                                }
                            });
                        } else {
                            console.warn(res)
                        }

                    } else {
                        options.ok ? options.ok(res.data) : console.warn('Missed successful handler');
                    }

                }, function (res) {
                    spinner.hide();
                    options.fail ? options.fail(res) :
                        pop.usual({
                            title: 'ERROR',
                            msg: res.data.msg,
                            type: 'error'
                        });
                });

            } else {
                pop.usual({
                    title: 'ERROR',
                    msg: 'options not an object',
                    type: 'error'
                });
            }
        }
        return request;
    });
})();