'use strict';
var login = {

    // 注册
    onRegister: function () {
        yqd.queryAt('#onRegister', function (e) {

            var account = yqd.queryAt('#account').value,
                pass = yqd.queryAt('#pass').value;

            if (!pass || !yqd.regEx('CONTENT', pass)) {
                $.toast("密码不能为空或格式不正确");
                return;

            } else if (!account || !yqd.regEx('PHONE', account)) {
                $.toast("手机号不能为空或格式不正确");
                return;
            } else {
                yqd.request({
                    loader: '注册中',
                    type: 'POST',
                    url: 'login',
                    data: {
                        type: 'use',
                        pass: pass,
                        account: account,
                    },
                    ok: function (res) {
                        $.toast("登陆成功", function () {
                            spa.go('home');
                        });
                    },
                    fail: function (res) {
                        $.toast(res.msg);
                    }
                })
            }
        })
    },

    checkLogin: function () {
        yqd.request({
            loader: '注册中',
            type: 'POST',
            url: 'check/login',
            data: {},
            ok: function (res) {
                spa.go('home');
            },
            fail:function(res){
            	
            }
        })
    },

    init: function () {
        this.onRegister();
        this.checkLogin();
        yqd.hideTab();
    }
}
login.init();