angular.module('zm').controller('sysCtrl', function ($scope, $filter, $modal, $rootVPath, request, spinner, pop, dateRange) {
    'use strict';
    $scope.sum = 0;  //数据总条数
    $scope.len = 15; //每页显示条数
    $scope.max = 5;  //显示页数按钮个数
    $scope.page = 1;


    $scope.FnSys = {
        //render lsit
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Number/lists',
                data: {
                    p: p || 1,
                    size: $scope.len,
                    stime: $scope.stime,
                    etime: $scope.etime,
                    remark: $scope.remark || ''
                },
                ok: function (res) {
                    $scope.listData = res.data.lists;
                    $scope.sum = res.data.number;
                }
            });
        },

        add: function () {
            var _this = this;
            $modal.open({
                templateUrl: 'views/template/sys_set_add.html',
                controller: function ($scope, $modalInstance) {
                    //保存
                    $scope.ok = function () {
                        $scope.wait = true;
                        request({
                            url: $rootVPath + 'Number/add',
                            data: {
                                key: $scope.name,
                                data: $scope.data,
                                remark: $scope.remark
                            },
                            ok: function (res) {
                                $scope.wait = false;
                                pop.usual({
                                    title: '新增成功',
                                    msg: res.msg ? res.msg : '新增成功',
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
                                    title: '新增失败',
                                    msg: res.msg ? res.msg : '新增失败',
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

        edit: function (index) {
            var _this = this,
                itemInfo = $scope.listData[index];

            if (itemInfo.number > 0) {
                request({
                    url: $rootVPath + 'Number/edit',
                    data: {
                        id: itemInfo.id,
                        data: itemInfo.number
                    },
                    ok: function (res) {
                        pop.usual({
                            title: '修改成功',
                            msg: res.msg ? res.msg : '修改成功',
                            type: 'success',
                            handler: function (res) {
                                _this.render();
                            }
                        });
                    },
                    fail: function (res) {
                        pop.usual({
                            title: '修改失败',
                            msg: res.msg ? res.msg : '修改失败',
                            handler: function (res) {
                                _this.render();
                            }
                        });
                    }
                });
            } else {
                pop.usual({
                    title: '温馨提示',
                    msg: '不能为0',
                    handler: function (res) {
                        _this.render();
                    }
                });
            }

        },


        init: function () {
            this.render();
        }
    }
    $scope.FnSys.init();
});