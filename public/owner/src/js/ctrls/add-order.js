'use strict';

var stats = true;

$("#city-picker").cityPicker({
    title: "请选择收货地址",

});


function xuan(__this) {
    $(".add-order").on('click', '.num-tip', function () {
        $('.num-tip').removeClass('xuan-bo');
        $(this).addClass('xuan-bo');
    });
}

function getNum() {
    yqd.request({
        loader: '获取规格',
        type: 'POST',
        url: 'order/num',
        data: {},
        ok: function (listData) {
            var content = '';

            listData.data.forEach(function (e, i) {
                if (i == 0) {
                    content += '<div class="num-tip xuan-bo" data-id="' + e.id + '">' + e.name + '</div>';
                } else
                    content += '<div class="num-tip" data-id="' + e.id + '">' + e.name + '</div>';

            });
            $(".goods-num-json").html(content);
            $(".add-order").removeClass('hide');
            xuan();
            $(".add-order").removeClass('hide');
        }
    })
};
getNum();
yqd.showTab();

function check() {
    var mobile = $("#mobile").val(),
        name = $("#name").val();

    if (!mobile || !yqd.regEx('PHONE', mobile)) {
        return;
    }

    if (!name || !yqd.regEx('NAME', name)) {
        return;
    }
    var post = {
        'mobile': mobile,
        'name': name,
    };

    yqd.request({
        loader: '查看订单',
        type: 'POST',
        url: 'order/check',
        data: post,
        ok: function (res) {
            stats = false;
        },
        fail: function (res) {
            stats = true;
        }
    })
}


yqd.queryAt('.add-button', 'click', function () {
    var city = $("#city-picker").val(),
        num = $(".xuan-bo").attr('data-id'),
        addr = $("#address").val(),
        mobile = $("#mobile").val(),
        name = $("#name").val(),
        remark = $("#remark").val();

    if (!mobile || !yqd.regEx('PHONE', mobile)) {
        $.toast('请填写正确手机号', 'cancel');
        return;
    }

    // if (!name || !yqd.regEx('NAME', name)) {
    //     $.toast('请填写真实姓名', "cancel");
    //     return;
    // }

    if (!num || !yqd.regEx('NUM', num)) {
        $.toast('请填写购买数量', "cancel");
        return;
    }

    if (!city || !yqd.regEx('CONTENT', city)) {
        $.toast('请填写省市区', "cancel");
        return;
    }

    if (!addr || !yqd.regEx('CONTENT', addr)) {
        $.toast('请填写详细地址', "cancel");
        return;
    }


    var cityLeng = city.split(' ');
    console.log(cityLeng);
    if (cityLeng.length < 3) {
        $.toast('请填写完整的省市区', "cancel");
        return;
    }

    if (!remark) {
        $.toast('请填写备注', "cancel");
        return;
    }

    var post = {
        'city': city,
        'num': num,
        'addr': addr,
        'mobile': mobile,
        'name': name,
        'remark': remark
    };

    check();
    if (stats) {
        $.confirm({
            title: '提交订单',
            text: '请核对收货信息',
            onOK: function () {
                yqd.request({
                    loader: '获取规格',
                    type: 'POST',
                    url: 'order/add',
                    data: post,
                    ok: function (res) {
                        $.toast('添加成功', function () {
                            spa.go('home');
                        });
                        return;
                    },
                    fail: function (res) {
                        $.toast(res.msg, "cancel");
                        return;
                    }
                })
            },
        });
    } else {
        if (window.confirm('存在重复订单，是否继续提交？')) {
            yqd.request({
                loader: '获取规格',
                type: 'POST',
                url: 'order/add',
                data: post,
                ok: function (res) {
                    $.toast('添加成功', function () {
                        spa.go('home');
                    });
                    return;
                },
                fail: function (res) {
                    $.toast(res.msg, "cancel");
                    return;
                }
            })
            return true;
        } else {
            return false;
        }
    }

});


$(".tip-button").on('click', function () {
    var text = $("#addr").val();

    if (text)
        yqd.request({
            loader: '智能解析',
            type: 'POST',
            url: 'order/addr',
            data: {text: text},
            ok: function (res) {
                $("#city-picker").val(res.data.address);
                $("#name").val(res.data.name);
                $("#mobile").val(res.data.phone);
                $("#address").val(res.data.addr);
                check();
                return;
            },
            fail: function (res) {
                $.toast('无法识别', "cancel");
                return;
            }
        });
});

$(".text-input").on('change', function () {
    check();
});

if ($("#goods-name").length > 0) {
    $("#goods-name").html(goods_name);
}
if ($("#goods_price").length > 0) {
    $("#goods_price").html(goods_price);
}
