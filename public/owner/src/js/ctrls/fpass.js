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
                    }
                })
            }
        })
    },

    onSend: function () {
        yqd.queryAt('#onSend', function (e) {

            var account = yqd.queryAt('#account').value;

            if (!account || !yqd.regEx('PHONE', account)) {
                $.toast("手机号不能为空或格式不正确");
                return;
            } else {
                yqd.request({
                    loader: '注册中',
                    type: 'POST',
                    url: 'forgot',
                    data: {
                        type: 'use',
                        account: account,
                    },
                    ok: function (res) {
                        $.toast(res.msg, 2000);
                    }
                })
            }
        })
    },

    init: function () {
        this.onRegister();
        this.onSend();
        yqd.hideTab();
    }
}
login.init();