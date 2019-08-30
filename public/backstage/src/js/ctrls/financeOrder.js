angular.module('zm').controller('orderCtrl', function ($scope, $modal, $rootVPath, regEx, request, spinner, pop, dateRange, msg, $http) {
    'use strict';
    $scope.sum = 0;  //数据总条数
    $scope.len = 15; //每页显示条数
    $scope.max = 5;  //显示页数按钮个数
    $scope.page = 1;

    $scope.dateOption = dateRange.dateOption;
    $scope.dateRange = dateRange.daterange;
    $scope.stime = '';
    $scope.etime = '';
    $scope.city = '';
    $scope.agent_name = '';
    $scope.oem_name = '';
    $scope.chioceLists = [
        {"id": 1, "name": "全部"},
        {"id": 2, "name": "已审核"},
        {"id": 3, "name": "待审核"}
    ];

    $scope.list = {
        //render lsit
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Order/lists',
                data: {
                    p: p || 1,
                    size: $scope.len,
                    type: $scope.selectedType || 1,
                    stime: $scope.stime,
                    etime: $scope.etime,
                    city: $scope.city || '',
                    agent_name: $scope.agent_name || '',
                    oem_name: $scope.oem_name || '',
                },
                ok: function (res) {
                    $scope.listData = res.data.lists;
                    $scope.sum = res.data.number;
                }
            });
        },

        edit: function (index) {

            var _this = this,
                itemInfo = $scope.listData[index];

            $modal.open({
                templateUrl: 'views/template/editOrder.html',
                controller: function ($scope, $modalInstance) {

                    //获取地址
                    $http.get('src/json/cityTri.json').then(function success(res) {
                        $scope.cityData = res.data;
                        angular.forEach($scope.cityData, function (item) {
                            if (item.label == itemInfo.province) {
                                $scope.province = item;
                                angular.forEach(item.children, function (each) {
                                    if (each.label == itemInfo.city) {
                                        $scope.city = each;
                                        angular.forEach(each.children, function (area) {
                                            if (area.label == itemInfo.area) {
                                                $scope.area = area;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }, function error(res) {
                        pop.usual({
                            title: "请求失败",
                            msg: '加载城市列表失败，请重试',
                            type: "error",
                        });
                    });

                    $scope.regPhone = regEx.PHONE;

                    $scope.name = itemInfo.user_name;
                    $scope.mobile = itemInfo.mobile;
                    $scope.province = itemInfo.province;
                    $scope.city = itemInfo.city;
                    $scope.area = itemInfo.area;
                    $scope.address = itemInfo.address;

                    //保存
                    $scope.ok = function () {

                        if (!$scope.province || $scope.province == null) {
                            msg.show('请选择省/市', 'danger');
                            return false;
                        }
                        if (!$scope.city || $scope.city == null) {
                            msg.show('请选择市/区', 'danger');
                            return false;
                        }

                        var param = {
                            id: itemInfo.id,
                            name: $scope.name,
                            mobile: $scope.mobile,
                            province: $scope.province.label,
                            city: $scope.city.label,
                            area: $scope.area.label,
                            address: $scope.address
                        };

                        $scope.wait = true;
                        request({
                            url: $rootVPath + 'Order/edit',
                            data: param,
                            ok: function (res) {
                                $scope.wait = false;
                                pop.usual({
                                    title: '修改成功',
                                    msg: res.msg ? res.msg : '修改成功',
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
                                    title: '修改失败',
                                    msg: res.msg ? res.msg : '修改失败',
                                });
                            }
                        });
                    };
                    //cancel join and close modal
                    $scope.cancel = function () {
                        $modalInstance.close();
                    };
                },
                backdrop: 'static'
            });
        },

        search: function () {
            var startDate = $scope.dateRange.startDate;
            var endDate = $scope.dateRange.endDate;
            if (startDate == null && endDate == null) {
                $scope.stime = '';
                $scope.etime = '';

            } else {
                var start_time = startDate.format('YYYY/MM/DD HH:mm:ss');
                var end_time = endDate.format('YYYY/MM/DD HH:mm:ss');
                $scope.stime = Date.parse(new Date(start_time)) / 1000;
                $scope.etime = Date.parse(new Date(end_time)) / 1000;
            }
            $scope.page = 1;
            this.render();
        },

        toExcel: function () {
            var strat_time = $scope.stime || 0;
            var end_time = $scope.etime || 0;
            var city = $scope.city || 0;
            var type = $scope.selectedType || 0;
            var agent_name = $scope.agent_name || 0;
            var oem_name = $scope.oem_name || 0;

            window.location.href = $rootVPath + 'Order/toExcel?sTime=' + strat_time + '&eTime' + end_time + '&city=' + city + '&agent_name=' + agent_name + '&oem_name=' + oem_name + '&type=' + type;

        },
        toUExcel: function () {
            var strat_time = $scope.stime || 0;
            var end_time = $scope.etime || 0;
            var city = $scope.city || 0;
            var type = $scope.selectedType || 0;
            var agent_name = $scope.agent_name || 0;
            var oem_name = $scope.oem_name || 0;

            window.location.href = $rootVPath + 'Order/toExcelUser?sTime=' + strat_time + '&eTime' + end_time + '&city=' + city + '&agent_name=' + agent_name + '&oem_name=' + oem_name + '&type=' + type;

        },
        init: function () {
            $scope.dateRange = {startDate: moment().startOf('hour'), endDate: moment().startOf('hour')};
            this.render();
        }

    }
    $scope.list.init();
});