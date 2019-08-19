'use strict';
var addAgent = {


    // 注册
    onRegister: function () {
        var _thisData = this.data;
        yqd.queryAt('#onRegister', function (e) {
            var name = yqd.queryAt('#name').value, phone = yqd.queryAt('#phone').value;
            if (!name || !yqd.regEx('NAME', name)) {
                yqd.toast({content: '姓名不能为空或格式不正确'});
                return;

            } else if (!phone || !yqd.regEx('PHONE', phone)) {
                yqd.toast({content: '手机号不能为空或格式不正确'});
                return;
            } else {
                yqd.request({
                    loader: '注册中',
                    type: 'POST',
                    url: 'agent/add',
                    data: {
                        type: _thisData.carType,
                        lngAndLat: _thisData.latng,
                        name: name,
                        phoneNumber: phone,
                    },
                    ok: function (res) {
                        spa.go('step')
                        yqd.toast({
                            content: '添加成功，密码为：' + res.pass,
                            type: 'success',
                            callback: function () {
                                spa.go('home');
                            }
                        })
                    }
                })
            }
        })
    },

    init: function () {
        this.onRegister();
    }
}
addAgent.init();