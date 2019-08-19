angular.module('zm').controller('sysCodeCtrl', function ($scope, $modal, $filter, $http, $rootVPath, request, spinner, dateRange, pop) {
    'use strict';             //                           		$scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange, msg

    $scope.dateOption = dateRange.dateOption;
    $scope.dateRange = dateRange.daterange;
    $scope.stime = '';
    $scope.etime = '';

    $scope.list = {

        // 获取已设置活动时间
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Setting/lists',
                data: {
                    p: p || 1,
                    size: $scope.len,
                    stime: $scope.stime,
                    etime: $scope.etime,
                    name: 'ACTIVITY'
                },
                ok: function (res) {
                    $scope.dateRange.startDate = res.data.lists.sDate;
                    $scope.dateRange.endDate = res.data.lists.eDate;
                    $scope.number = res.data.lists.number;
                }
            });
        },

        // 修改活动时间
        edit: function (type) {
            var _this = this;
            if (type == 'num') {
                var num = $scope.number;
                var data = {id: 2, num: num};
            } else {
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
                    var data = {id: 1, sTime: $scope.stime, etime: $scope.etime}
                }
            }
            $scope.wait = true;
            // 请求接口
            request({
                url: $rootVPath + 'Setting/edit',
                data: data,
                ok: function (res) {
                    $scope.wait = false;
                    pop.usual({
                        title: '设置成功',
                        msg: res.msg ? res.msg : '设置成功',
                        type: 'success',
                        handler: function (res) {
                            //  $modalInstance.close();
                            _this.render();
                        }
                    });
                },
                fail: function (res) {
                    $scope.wait = false;
                    pop.usual({
                        title: '设置失败',
                        msg: res.msg ? res.msg : '设置失败',
                    });
                }
            });
        },

        init: function () {
            $scope.dateRange = {startDate: moment(), endDate: moment()};
            this.render();
        }

    }
    $scope.list.init();

});