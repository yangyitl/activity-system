'use strict';
var order = {
    data: {
        tab: 0,
        p: 1,
        size: 15,
        type: 0,
        sTime: '',
        eTime: '',
        listTotal: 0,
        sort: 0
    },
    //渲染列表
    renderList: function (listData) {
        console.log(this.data.sort);
        if (listData.length) {
            var status, orderStatus = '', content = '', __thisData = this.data;

            listData.forEach(function (e, i) {

                switch (e.status) {
                    case -1:
                        status = '已关闭';
                        orderStatus = 'order-status';
                        break;
                    case 0:
                        status = '待提交';
                        orderStatus = 'order-status';
                        break;
                    case 1:
                        orderStatus = '';
                        status = '未审核';
                        break;
                    default:
                        orderStatus = '';
                        status = '已审核';
                        break;

                }
                var totalAmount = e.total_amount / 100,
                    listTop = '';
                __thisData.sort = __thisData.sort + 1;
                if (i != 0 || __thisData.p != 1) {
                    listTop = 'list-top';
                } else {
                    listTop = '';
                }
                content += '<div class="bd ' + listTop
                    + '">'
                    + '<div class="list-cells">'
                    + '<div class="weui-cell item-time">'
                    + '<div class="weui-cell__bd">'
                    + '<span class="me-order-mark">序号:' + __thisData.sort + '</span>'
                    + e.consignee
                    + '</div>'
                    + '<div class="weui-cell__ft">'
                    + '<button class="order-d" data-text="' + e.consignee + ',' + e.mobile + ','
                    + e.province + ',' + e.city + ',' + e.area + ',' + e.address + ',' + e.id + ',' + e.status
                    + '">订单详情</button>';

                if (e.status == 0) {
                    content += '<button class="order-c" data-text="' + e.consignee + ',' + e.mobile + ','
                        + e.province + ',' + e.city + ',' + e.area + ',' + e.address + ',' + e.id + ',' + e.status
                        + '">关闭订单</button>';
                }

                content += '<button class="order-s ' + orderStatus
                    + '"  data-text="' + e.consignee + ',' + e.mobile + ','
                    + e.province + ',' + e.city + ',' + e.area + ',' + e.address + ',' + e.id + ',' + e.status
                    + '">' + status
                    + '</button>'
                    + '</div></div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">纪莱熙|纪莱熙轻透美肌隔离防护喷雾</div>'
                    + '<div class="weui-cell__ft">¥19.9</div></div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">纪莱熙|纪莱熙轻透美肌隔离防护喷雾</div>'
                    + '<div class="weui-cell__ft">'
                    + '<div>x' + e.number + '</div>'
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
            // console.log(__thisData.sort);
            return content
        }
    },

    //获取列表数据
    getList: function (type) {
        var _this = this, _thisData = this.data,
            data = {
                p: _thisData.p,
                size: _thisData.size,
            };

        yqd.request({
            type: 'POST',
            url: 'order/mlist',
            data: data,
            ok: function (res) {
                var info = res.data;
                if (!info.list.length) {
                    if (type == 'refresh') {
                        content = '<div class="weui-loadmore weui-loadmore_line">'
                            + '<span class="weui-loadmore__tips">暂无订单</span>'
                            + '</div>';
                        $('#panel').html(content);
                    } else
                        $.toptip('暂无订单', 'error');

                } else {
                    _thisData.listTotal = info.listTotal;
                    switch (type) {
                        //刷新或重置列表
                        case'refresh':
                            var content = _this.renderList(info.list);
                            $('#panel').append(content);
                            break;
                        //加载更多
                        default:
                            var content = _this.renderList(info.list);
                            $('#panel').append(content);
                            break;
                    }
                }
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

    editShow: function () {
        $("#panel").on('click', '.order-d', function () {
            var text = $(this).attr('data-text').split(','),
                addr = text[2] + text[3] + text[4] + text[5],
                id = text[6], stats = text[7];

            $("#name").text(text[0]);
            $("#mobile").text(text[1]);
            $(".details-addr").text(addr);
            $(".details-bot-edit").attr('data-id', id);
            if (stats == 0) {
                $(".details-bot-edit").removeClass('hide');

            } else {
                $(".details-bot-edit").addClass('hide');
            }


            $(".details").removeClass('hide');
        })
    },

    delShow: function () {
        var _this = this;
        $("#panel").on('click', '.order-c', function () {
            var text = $(this).attr('data-text').split(','),
                addr = text[2] + text[3] + text[4] + text[5],
                id = text[6], stats = text[7];

            if (stats != 0) {
                return '';
            }
            $.confirm({
                title: '确定关闭',
                text: '<div>订单详情:' + text[0] + text[1] + '</div><div>地址详情:' + addr + '</div>',
                onOK: function () {
                    yqd.request({
                        type: 'POST',
                        url: 'order/del',
                        data: {id: id},
                        ok: function (res) {
                            _this.data = Object.assign(_this.data, {
                                p: 1,
                            });
                            $('#panel').html('');
                            _this.getList('refresh');
                        }
                    })
                },
            });

        })
    },

    // submit: function () {
    //     var _this = this;
    //     $("#panel").on('click', '.order-s', function () {
    //         var text = $(this).attr('data-text').split(','),
    //             addr = text[2] + text[3] + text[4] + text[5],
    //             id = text[6], stats = text[7];
    //
    //         if (stats != 0) {
    //             return '';
    //         }
    //         $.confirm({
    //             title: '提交审核',
    //             text: '<div>订单详情:' + text[0] + text[1] + '</div><div>地址详情:' + addr + '</div>',
    //             onOK: function () {
    //                 yqd.request({
    //                     type: 'POST',
    //                     url: 'order/submit',
    //                     data: {id: id},
    //                     ok: function (res) {
    //                         _this.data = Object.assign(_this.data, {
    //                             p: 1,
    //                         });
    //                         $('#panel').html('');
    //                         _this.getList('refresh');
    //                     }
    //                 })
    //             },
    //         });
    //
    //     })
    // },

    edit: function () {
        $(".details").on('click', '.details-bot-edit', function () {
            var id = $(this).attr('data-id');
            spa.go('editOrder?id=' + id);
        })
    },


    cancel: function () {
        yqd.queryAt('.details-bot-ca', 'click', function () {
            $(".details").addClass('hide');
        });
    },


    init: function () {
        this.getList('refresh');
        this.onMore();
        this.cancel();
        this.edit();
        this.editShow();
        this.delShow();
        // this.submit();
        yqd.showTab();
    }
};
order.init();