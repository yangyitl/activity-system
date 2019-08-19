angular.module('zm').controller('loginCtrl', function ($scope, $state, $rootVPath, request, regEx, md5, pop) {
    'use strict';
    $scope.regUser = regEx.USER;
    $scope.regAccount = regEx.PHONE;
    $scope.regPass = regEx.PASS;
    $scope.regNum = regEx.EN_NUM;
    $scope.login = {
        effect: function () {
            var bgs = ['src/img/bgs/1.jpg', 'src/img/bgs/2.jpg', 'src/img/bgs/3.jpg', 'src/img/bgs/4.jpg', 'src/img/bgs/5.jpg', 'src/img/bgs/6.jpg', 'src/img/bgs/7.jpg', 'src/img/bgs/8.jpg', 'src/img/bgs/9.jpg', 'src/img/bgs/10.jpg', 'src/img/bgs/11.jpg', 'src/img/bgs/12.jpg'];
            var i = Math.floor(Math.random() * 11);
            $scope.bg = {
                'background': 'url(' + bgs[i] + ') no-repeat center',
                'background-color': 'rgba(0,0,0,.5)',
                'background-size': 'cover'
            }
        },
        on: function () {
            if (!$scope.account && !$scope.pass) {
                pop.toast('请输入手机号和密码', 'error');
            } else if (!$scope.account) {
                pop.toast('请输入手机号', 'error');
            } else if (!$scope.pass) {
                pop.toast('请输入密码', 'error');
            } else if (!$scope.code) {
                pop.toast('请输入验证码', 'error');
            } else if (angular.uppercase($scope.code) != angular.uppercase($scope.vcode)) {
                pop.toast('验证码不正确', 'error');
            } else {
                request({
                    url: $rootVPath + 'login',
                    data: {
                        account: $scope.account,
                        password: md5.createHash($scope.pass)
                    },
                    ok: function (res) {
                        pop.toast('登录成功,正在进入...', 'success');
                        $state.go('dashboards.board');
                    },
                    fail: function (res) {
                        pop.toast(res.data.msg, 'error');
                    }
                });
            }
        },

        init: function () {
            this.effect();
        }
    }
    $scope.login.init();

    //press enter to login
    $scope.enterKey = function (e) {
        var keyCode = window.event ? e.keyCode : e.which;
        if (keyCode = 13) {
            $scope.login.on();
        }
    }
});