'use strict';

var home = {
    onShow: function () {
        yqd.request({
            type: 'GET',
            url: 'index',
            ok: function (res) {
                if (res.status == 200) {
                    var info = res.data;
                    yqd.queryAt('#nickname').innerText = info.name || '昵称';
                    yqd.queryAt('#meOrder ').innerText = info.meOrder || '0';
                    yqd.queryAt('#subOrder').innerText = info.subOrder || '0';
                    yqd.queryAt('#totalOrder').innerText = info.totalOrder || '0';
                    yqd.queryAt('#unOrder').innerText = info.unOrder || '0';
                    if (info.log)
                        yqd.queryAt('#log').innerText = info.log.remark || "暂无公告";
                    else
                        yqd.queryAt('#log').innerText = '暂无公告';

                    $(".home").removeClass('hide');
                } else {
                    $.toast(res.msg, "text");
                }
            },
        })
    },

    show: function () {
        yqd.queryAt('#addAgent', 'click', function () {
            $("#addAgentHide").removeClass('hide');
        });
    },

    cancel: function () {
        yqd.queryAt('.c-botton', 'click', function () {
            $(".add-agent").addClass('hide');
        });
    },

    add: function () {
        yqd.queryAt('.s-botton', 'click', function () {
            var name = $("#name").val(),
                mobile = $("#mobile").val();

            if (!mobile || !yqd.regEx('PHONE', mobile)) {
                $.toast('手机号不能为空或格式不正确', "text");
                return;
            }

            // if (!name || !yqd.regEx('NAME', name)) {
            //     $.toast('请填写真实姓名', "text");
            //     return;
            // }
            yqd.request({
                type: 'POST',
                url: 'add/agent',
                data: {name: name, account: mobile},
                ok: function (res) {
                    console.log(res);
                    $(".add-agent").addClass('hide');
                    yqd.queryAt('#agree').setAttribute('data-clipboard-text', res.data.cp);
                    $("#s_mobile").val(res.data.account);
                    $("#s_pass").val(res.data.pass);
                    $("#s_add").removeClass('hide');
                    return;
                },
                fail: function (res) {
                    $.toast(res.msg, "text");
                    return;
                }
            })
        });
    },

    clip: function () {
        yqd.queryAt('.cp-botton', 'click', function () {
            var clipboard = new ClipboardJS("#agree");
            clipboard.on('success', function (e) {
                if (e.text) console.log('copy ok');
                $.toast('复制成功', function () {
                    $("#s_add").addClass('hide');
                });
            }).on('error', function (e) {
                console.log('copy err');
            });
        });
    },

    init: function () {
        this.clip();
        this.onShow();
        this.show();
        this.add();
        this.cancel();
        yqd.showTab();
    }
};
home.init();