$("#city-picker").cityPicker({
    title: "请选择收货地址"
});
var url = yqd.getRequest();

function init() {
    console.log(url);
    if (url) {
        if (url.id) {
            yqd.request({
                loader: '获取规格',
                type: 'POST',
                url: 'order/item',
                data: {id: url.id},
                ok: function (res) {
                    var e = res.data;
                    $("#name").val(e.start_name);
                    $("#mobile").val(e.mobile);
                    $("#city-picker").val((e.province + ' ' + e.city + ' ' + e.area));
                    $("#addr").val(e.address);
                    $(".edit-order").removeClass('hide');
                    return;
                },
                fail: function (res) {
                    $.toast('请选择正确订单进行修改', "cancel");
                    return;
                }
            })
        }
    } else {
        $.toast('请选择正确订单进行修改', "cancel");
        return;
    }
};

init();
yqd.showTab();

$(".button").click(function () {
    var city = $("#city-picker").val(),
        addr = $("#addr").val(),
        mobile = $("#mobile").val(),
        name = $("#name").val();


    if (!mobile || !yqd.regEx('PHONE', mobile)) {
        $.toast('请填写正确手机号', 'cancel');
        return;
    }

    if (!name || !yqd.regEx('NAME', name)) {
        $.toast('请填写真实姓名', "cancel");
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

    var post = {
        id: url.id,
        city: city,
        addr: addr,
        mobile: mobile,
        name: name,
    };

    yqd.request({
        loader: '修改中',
        type: 'POST',
        url: 'order/edit',
        data: post,
        ok: function (res) {
            $.toast('修改成功', function () {
                spa.go('meOrder');
            });
            return;
        },
        fail: function (res) {
            $.toast(res.msg, "cancel");
            return;
        }
    })
});