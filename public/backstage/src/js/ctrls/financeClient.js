angular.module('zm').controller('clientCtrl', function ($scope, $modal, $rootVPath, regEx, request, spinner, pop, dateRange, msg) {
    'use strict';
    $scope.sum = 0;  //数据总条数
    $scope.len = 15; //每页显示条数
    $scope.max = 5;  //显示页数按钮个数
    $scope.page = 1;
    $scope.tab = 1;

    $scope.dateOption = dateRange.dateOption;
    $scope.dateRange = dateRange.daterange;
    $scope.stime = '';
    $scope.etime = '';

    $scope.list = {
        //render lsit
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Users/lists',
                data: {
                    p: p || 1,
                    size: $scope.len,
                    stime: $scope.stime,
                    etime: $scope.etime,
                    name: $scope.name || ''
                },
                ok: function (res) {
                    $scope.listData = res.data.lists;
                    $scope.sum = res.data.number;
                }
            });
        },

        search: function () {
            var startDate = $scope.dateRange.startDate;
            var endDate = $scope.dateRange.endDate;
            if (startDate == null && endDate == null) {
                $scope.stime = '';
                $scope.etime = '';

            } else {
                var start_time = startDate.format('YYYY/MM/DD');
                var end_time = endDate.format('YYYY/MM/DD');
                $scope.stime = Date.parse(new Date(start_time)) / 1000;
                $scope.etime = Date.parse(new Date(end_time)) / 1000;
            }
            $scope.page = 1;
            this.render();
        },

        //发货
        addLogistics: function (id) {
            var _this = this;
            $modal.open({
                templateUrl: 'views/template/finance_client_logistics.html',
                controller: function ($scope, $modalInstance) {
                    $scope.ok = function () {
                        $scope.wait = true;
                        request({
                            url: $rootVPath + 'pclient/edit',
                            data: {
                                val: id,
                                express_no: $scope.express_no,
                                client: $scope.client,
                            },
                            ok: function (res) {
                                $scope.wait = false;
                                pop.usual({
                                    title: '发货成功',
                                    msg: res.msg ? res.msg : '发货成功',
                                    type: 'success',
                                    handler: function (res) {
                                        $modalInstance.close();
                                        _this.render();
                                    }
                                });
                            },
                            fail: function (res) {
                                $scope.wait = false;
                                pop.usual({
                                    title: '发货失败',
                                    msg: res.msg ? res.msg : '发货失败',
                                });
                            }
                        });

                    };

                    $scope.cancel = function () {
                        $modalInstance.close();
                    };
                },
                backdrop: 'static'
            });
        },

        //设备查看物流
        logisticsMsg: function (id) {
            var _this = this;
            request({
                url: $rootVPath + 'pclient/item',
                data: {
                    val: id
                },
                ok: function (res) {
                    var logisticsData = res.data;
                    $modal.open({
                        templateUrl: 'views/template/client_logistics.html',
                        controller: function ($scope, $modalInstance) {
                            $scope.logisticsData = logisticsData;

                            $scope.cancel = function () {
                                $modalInstance.close();
                            };
                        },
                        backdrop: 'static'
                    });
                }
            });
        },

        //switch tab
        switch: function (i) {
            $scope.tab = i;
            $scope.dateRange = {startDate: moment(), endDate: moment()};
            this.render();
        },

        init: function () {
            this.switch(1);
        }

    }
    $scope.list.init();
});