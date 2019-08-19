angular.module('zm').controller('dbBackUpCtrl', function ($scope, $filter, $modal, $rootVPath, request, spinner) {
    'use strict';
    $scope.sum = 0;  //数据总条数
    $scope.len = 15; //每页显示条数
    $scope.max = 5;  //显示页数按钮个数
    $scope.page = 1;

    $scope.DbBackUp = {
        //render lsit
        render: function (p) {
            typeof p == 'undefined' ? $scope.page = 1 : null;
            spinner.show();
            request({
                url: $rootVPath + 'Sql/lists',
                data: {
                    p: p || 1,
                    size: $scope.len
                },
                ok: function (res) {
                    $scope.listData = [];
                    $scope.listData = res.data.lists;
                    $scope.sum = res.data.number;
                }
            });
        },


        downloadDb: function (name) {

            window.location.href = $rootVPath + 'Sql/downloadFiles?name=' + encodeURI(name);

        },

        init: function () {
            this.render();
        }
    }

    $scope.DbBackUp.init();
});