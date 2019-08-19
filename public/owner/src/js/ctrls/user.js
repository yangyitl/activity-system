'use strict';
var login = {

    // 退出
    logout: function () {
        yqd.queryAt('.weui-btn_primary', function (e) {
            yqd.request({
                loader: '退出中',
                type: 'POST',
                url: 'logout',
                data: {
                    type: 'use',
                },
                ok: function (res) {
                    $.toast("退出成功", function () {
                        spa.go('login');
                    });
                }
            })
        })
    },

    show: function () {
        yqd.request({
            loader: '加载中',
            type: 'POST',
            url: 'user/index',
            data: {
                type: 'use',
            },
            ok: function (res) {
                $(".weui-media-box__title").text(res.data.name);
                $(".user").removeClass('hide');
            }
        })
    },
    init: function () {
        this.show();
        this.logout();
        yqd.showTab();
    }
}
login.init();