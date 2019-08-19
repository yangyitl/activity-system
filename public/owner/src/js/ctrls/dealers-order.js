'use strict';
var dealersOrder = {
    data: {
        tab: 0,
        p: 1,
        size: 15,
        type: 0,
        listTotal: 0,
        sort: 0,
        id: 0
    },
    //渲染列表
    renderList: function (info) {
        console.log(this.data.sort);
        var listData = info.list;
        if (listData.length) {
            var status, orderStatus,
                content = '',
                __thisData = this.data,
                userId = info.userId;


            listData.forEach(function (e, i) {
                if (__thisData.id == e.user_id){
                    switch (e.status) {
                        case 0:
                            status = '待提交';
                            orderStatus = 'order-audit';
                            break;
                        case 1:
                            status = '待审核';
                            orderStatus = 'order-audit';
                            break;
                        case 2:
                            status = '已审核';
                            orderStatus = 'order-win';
                            break;
                        default:
                            status = '待提交';
                            orderStatus = 'order-audit';
                            break;
                    }
                } else {
                    switch (e.pstatus) {
                        case 1:
                            status = '待提交';
                            orderStatus = 'order-audit';
                            break;
                        case 2:
                            status = '待审核';
                            orderStatus = 'order-audit';
                            break;
                        case 3:
                            status = '已审核';
                            orderStatus = 'order-win';
                            break;
                        default:
                            status = '待提交';
                            orderStatus = 'order-audit';
                            break;
                    }
                }


                var totalAmount = e.total_amount / 100,
                    listTop = '';
                var priceUnit = e.price / 100;
                if (i != 0 || __thisData.p != 1) {
                    listTop = 'list-top';
                } else {
                    listTop = '';
                }
                __thisData.sort = __thisData.sort + 1;


                if (e.status == 1) {
                    var inPut = '<input type="radio" data-id="' + e.id
                        + '"  value="' + e.id + '" data-user="' + e.start_id
                        + '" class="radio">';
                    $(".radio-all").removeClass('hide');
                } else {
                    var inPut = '<input type="radio" data-id="' + e.id
                        + '"  value="' + e.id + '" data-user="' + e.start_id
                        + '" class="radio">';
                    $(".radio-all").removeClass('hide');
                }

                content += '<div class="bd ' + listTop
                    + '">'
                    + '<div class="list-cells">'
                    + '<div class="weui-cell item-time">'
                    + '<div class="weui-cell__bd">'
                    + '<span class="d-order-mark">' + inPut + '</span>' + e.consignee
                    + '</div>'
                    + '<div class="weui-cell__ft">'
                    + '<button class="order-d" data-text="' + e.consignee + ',' + e.mobile + ','
                    + e.province + ',' + e.city + ',' + e.area + ',' + e.address + ',' + e.id
                    + '">订单详情</button>'
                    + '<button data-text="' + e.id + ',' + e.status + ',' + e.consignee + ',' + e.mobile + ',' + userId
                    + ',' + e.start_id + ',' + e.province + ',' + e.city + ',' + e.area + ',' + e.address
                    + '" class="order-s ' + orderStatus
                    + '">' + status
                    + '</button>'
                    + '</div></div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">' + e.goods_name + '</div>'
                    + '<div class="weui-cell__ft">¥' + priceUnit + '</div></div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">' + e.goods_name + '</div>'
                    + '<div class="weui-cell__ft">'
                    + '<div>x' + e.number
                    + '</div>'
                    + '<div>实付：<span class="sum">' + totalAmount + '</span></div>'
                    + '</div></div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">添加时间</div>'
                    + '<div class="weui-cell__ft">' + e.created_at + '</div></div>'
                    + '</div>'
                    + '</div>';
            });
            if (__thisData.p * __thisData.size < __thisData.listTotal) {
                content += '<div id="weui-loadmore" class="weui-loadmore weui-loadmore_line">'
                    + '<span class="weui-loadmore__tips">点击查看更多</span>'
                    + '</div>';
            } else {
                content += '<div class="weui-loadmore weui-loadmore_line">'
                    + '<span class="weui-loadmore__tips">人家也是有底线的</span>'
                    + '</div>';
            }
            return content
        }
    },

    //获取列表数据
    getList: function (type) {
        var _this = this, _thisData = this.data,
            url = yqd.getRequest();

        if (!url) {
            $.toast('请选择经销商', "cancel");
            return;
        }
        console.log(url);
        _thisData.id = url.id;

        var data = {
            id: url.id,
            p: _thisData.p,
            size: _thisData.size,
            status: _thisData.tab,
        };
        yqd.request({
            type: 'POST',
            url: 'order/dlist',
            data: data,
            ok: function (res) {
                var info = res.data;
                $('#sbu').text(info.sbu);
                $('#unSbu').text(info.unSbu);
                $('#submit').text(info.submit);
                $('#name').text(info.name);
                $('#totalNum').text(info.totalNum);
                $('#totalMon').text(info.totalMon);
                if (!info.list.length) {
                    console.log(type);
                    if (type == 'refresh') {
                        content = '<div class="weui-loadmore weui-loadmore_line">'
                            + '<span class="weui-loadmore__tips">暂无订单</span>'
                            + '</div>'
                        $('#panel').html(content);
                    } else
                        $.toptip('暂无订单', 'error');
                } else {
                    _thisData.listTotal = info.listTotal;
                    switch (type) {
                        //刷新或重置列表
                        case'refresh':
                            var content = _this.renderList(info);
                            $('#panel').append(content);
                            break;
                        //加载更多
                        default:
                            var content = _this.renderList(info);
                            $('#panel').append(content);
                            break;
                    }
                }
                yqd.showTab();
                $(".order").removeClass('hide');
            }
        })
    },

    //加载更多数据
    onMore: function () {
        var _this = this, _thisData = this.data;
        $("#panel").on('click', '#weui-loadmore', function () {
            $(this).addClass('hide');
            _thisData.p += 1;
            _this.getList('more')
        })
    },

    // 切换tab
    switchTab: function () {
        var _this = this,
            url = yqd.getRequest();
        _this.data.tab = url.tab;
        weui.tab('#tab', {
            defaultIndex: _this.data.tab,
            onChange: function (idx) {
                // 切换tab的时候初始化所有配置，并重新渲染对应的tab数据
                _this.data = Object.assign(_this.data, {
                    tab: idx,
                    p: 1,
                    type: 0,
                    sort: 0
                });
                $('#panel').html('');
                $('#sum').html('0.00元');
                _this.getList('refresh');
            }
        });
    },

    editShow: function () {
        $("#panel").on('click', '.order-d', function () {
            var text = $(this).attr('data-text').split(','),
                addr = text[2] + text[3] + text[4] + text[5],
                id = text[6], stats = text[7];

            $("#orderName").text(text[0]);
            $("#mobile").text(text[1]);
            $(".details-addr").text(addr);
            $(".details-bot-edit").attr('data-id', id);
            if (stats == 1) {
                $(".details-bot-edit").addClass('hide');
            } else {
                $(".details-bot-edit").removeClass('hide');
            }


            $(".details").removeClass('hide');
        })
    },

    submit: function () {
        var __this = this;
        $("#panel").on('click', '.order-s', function () {

            var text = $(this).attr('data-text').split(','),
                id = text[0], //订单id
                name = text[2], //名称
                mobile = text[3], //手机号
                stats = text[1], //状态
                userId = text[4],//用户Id
                startId = text[5],
                addr = text[6] + text[7] + text[8] + text[9];
            if (userId == startId) {
                switch (stats) {
                    case '0':
                        // $.confirm({
                        //     title: '提交审核',
                        //     text: '<div>订单详情:' + name + '--' + mobile + '</div><div>地址详情:' + addr + '</div>',
                        //     onOK: function () {
                        //         yqd.request({
                        //             type: 'POST',
                        //             url: 'order/submit',
                        //             data: {id: id},
                        //             ok: function (res) {
                        //                 $.toast('提交成功', function () {
                        //                     __this.data = Object.assign(__this.data, {
                        //                         p: 1,
                        //                     });
                        //                     $('#panel').html('');
                        //                     __this.getList('refresh');
                        //                 });
                        //             }
                        //         })
                        //     },
                        // });
                        break;
                    case '1':
                        $.alert({
                            title: '待审核',
                            text: '订单已提交，待上级审核',
                            onOK: function () {

                            }
                        });
                        break;
                    default:
                        return '';
                }
            } else {
                switch (stats) {
                    case '1':
                        $.confirm({
                            title: '提交审核',
                            text: '<div>订单详情:' + name + '--' + mobile + '</div><div>地址详情:' + addr + '</div>',
                            onOK: function () {
                                yqd.request({
                                    type: 'POST',
                                    url: 'order/sub',
                                    data: {id: id},
                                    ok: function (res) {
                                        $.toast('提交成功', function () {
                                            __this.data = Object.assign(__this.data, {
                                                p: 1,
                                            });
                                            $('#panel').html('');
                                            __this.getList('refresh');
                                        });
                                    }
                                })
                            },
                        });
                        break;
                    default:
                        return '';
                }
            }
            if ($(this).hasClass('order-win')) {
                return '';
            } else if ($(this).hasClass('order-audit')) {

            } else {

            }


        })
    },

    cancel: function () {
        yqd.queryAt('.details-bot-ca', 'click', function () {
            $(".details").addClass('hide');
        });
    },

    selectSubmit: function () {
        var __this = this;
        $("#panel").on('click', '.radio', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
            __this.sum();
        });
    },

    allSubmit: function () {
        var __this = this;
        $(".radio-all").on('click', '.sele-button', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $(".radio").removeClass('selected');
            } else {
                $(this).addClass('selected');
                $(".radio").addClass('selected');
            }
            __this.sum();
        });
    },

    sum: function () {
        var arr = this.idData();
        yqd.request({
            type: 'POST',
            url: 'order/sum',
            data: {ids: arr},
            ok: function (res) {
                $("#sum").text(res.data.sum);
            }
        });
    },

    buttonSubmit: function () {
        var __this = this;
        $(".radio-all").on('click', '.dealers-button', function () {
            var arr = __this.idData();
            if (arr.length <= 0 ){
                return '';
            }
            yqd.request({
                type: 'POST',
                url: 'order/asubmit',
                data: {ids: arr,id:__this.data.id},
                ok: function (res) {
                    $.toast('提交成功', function () {
                        __this.data = Object.assign(__this.data, {
                            p: 1,
                        });
                        $('#panel').html('');
                        __this.getList('refresh');
                    });
                },
            })
        });
    },

    idData: function () {
        var arr = [];
        $(".radio.selected").each(function () {
            var id = $(this).attr('data-id');
            if (id && id != "undefined")
                arr.push(id);
        });
        return arr;
    },

    init: function () {
        this.switchTab();
        this.getList('refresh');
        this.onMore();
        this.editShow();
        this.cancel();
        // this.submit();
        this.selectSubmit();
        this.allSubmit();
        this.buttonSubmit();

    }
};
dealersOrder.init();