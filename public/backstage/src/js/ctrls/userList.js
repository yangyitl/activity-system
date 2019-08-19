angular.module('zm').controller('userCtrl', function ($scope, $filter, $modal, $rootVPath, request, spinner, pop, regEx) {
    'use strict';
    $scope.sum = 0;  //数据总条数
    $scope.len = 15; //每页显示条数
    $scope.max = 5;  //显示页数按钮个数
    $scope.page = 1;

    $scope.FnUser = {
        //render lsit
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Users/lists',
                data: {
                    p: p || 1,
                    size: $scope.len,
                    name: $scope.name || '',
                    account: $scope.account || '',
                },
                ok: function (res) {
                    $scope.listData = [];
                    $scope.listData = res.data.lists;
                    $scope.sum = res.data.number;
                }
            });
        },

        isStatus: function (e, id) {
            var _this = this;
            var isChecked = e.target.checked,
                checkCode = isChecked ? 0 : 1;
            request({
                url: $rootVPath + 'Users/edit',
                data: {
                    id: id,
                    status: checkCode
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
                    isChecked ? e.target.checked = false : e.target.checked = true;
                    pop.usual({
                        title: '修改失败',
                        msg: res.msg ? res.msg : '修改失败',
                    });
                }
            });
        },

        del: function (index) {
            var _this = this,
                itemInfo = $scope.listData[index];

            var param = {
                id: itemInfo.id
            };
            pop.confirm({
                title: '温馨提示',
                msg: '您确定要删除该账号吗？',
                okText: '确定',
                type: 'question',
                confirm: function (res) {
                    request({
                        url: $rootVPath + 'Users/del',
                        data: param,
                        ok: function (res) {
                            $scope.wait = false;
                            pop.usual({
                                title: '删除成功',
                                msg: res.msg ? res.msg : '删除成功',
                                type: 'success',
                                handler: function (res) {
                                    _this.render();
                                }
                            });
                        },
                        fail: function (res) {
                            $scope.wait = false;
                            pop.usual({
                                title: '删除失败',
                                msg: res.msg ? res.msg : '删除失败',
                            });
                        }
                    });
                }
            })

        },

        add: function () {

            var _this = this;
            $modal.open({
                templateUrl: 'views/template/finance_produce_add.html',
                controller: function ($scope, $modalInstance) {

                    $scope.regPhone = regEx.PHONE;

                    $scope.ok = function () {

                        $scope.wait = true;
                        request({
                            url: $rootVPath + 'Users/add',
                            data: {
                                name: $scope.name,
                                account: $scope.account
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


        init: function () {
            this.render();
        }
    }
    $scope.FnUser.init();
});