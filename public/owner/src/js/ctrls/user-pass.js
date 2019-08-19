'use strict';
var userPass = {

    // 退出
    dPass: function () {
        yqd.queryAt('.d-pass', function (e) {
            yqd.request({
                loader: '退出中',
                type: 'POST',
                url: 'user/pass',
                data: {
                    type: 'use',
                },
                ok: function (res) {

                }
            })
        })
    },
    onRegister: function () {
        yqd.queryAt('#onRegister', function (e) {
            yqd.request({
                loader: '下一步',
                type: 'POST',
                url: 'user/rpass',
                data: {
                    type: 'use',
                },
                ok: function (res) {

                }
            })
        })
    },

    onPass: function () {
        yqd.queryAt('#onPass', 'click', function (e) {
            var oldPass = $("#oldPass").val(),
                newPass = $("#newPass").val();
            yqd.request({
                loader: '下一步',
                type: 'POST',
                url: 'user/epass',
                data: {
                    type: 'use',
                    oldPass: oldPass,
                    newPass: newPass
                },
                ok: function (res) {
                    $.alert({
                        title: '成功',
                        text: '修改成功，请记住新的密码',
                        onOK: function () {
                            spa.go('user');
                        }
                    });
                },
                fail: function (res) {
                    $.toast(res.msg, "cancel",);
                }
            })
        })
    },


    init: function () {
        this.dPass();
        this.onRegister();
        this.onPass();
        yqd.showTab();
        $(".pass").removeClass('hide');
    }
};
userPass.init();