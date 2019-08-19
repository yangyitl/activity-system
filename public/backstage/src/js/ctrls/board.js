angular.module('zm').controller('boardCtrl', function ($scope, $rootVPath, request, spinner, pop, $timeout) {
    'use strict';

    request({
        type: 'GET',
        url: $rootVPath + 'index',
        ok: function (res) {
            var dashboardsData = res.data;
            $scope.totalOrderNum = dashboardsData.totalOrderNum;
            $scope.totalUserNum = dashboardsData.totalUserNum;
            $scope.totalOrderMoney = dashboardsData.totalOrderMoney;
        }
    });

});