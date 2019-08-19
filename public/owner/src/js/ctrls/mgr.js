'use strict';
var dealers = {
    data: {
        tab: 0,
        p: 1,
        size: 30,
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
            var status, content = '', __thisData = this.data;
            listData.forEach(function (e, i) {
                var stats = e.type == 1 ? '已审核' : '提交审核',
                    msg = e.type == 0 ? e.user_name + '向你提交' + e.number + '待审核订单' : e.pname + '已审核' + e.number + '订单';

                content += '<div class="mgr-block">'
                    + '<div class="weui-cell item-top">'
                    + '<div class="weui-cell__bd">'
                    + '<span class="order-tip">' + e.remark + '</span>'
                    + '<span class="order-time">'+e.add_time+'</span>'
                    + '</div>'
                    + '<div class="weui-cell__ft">'
                    + '<button class="order-bot">' + stats + '</button>'
                    + '</div>'
                    + '</div>'
                    + '<div class="weui-cell">'
                    + '<div class="weui-cell__bd">'
                    + msg
                    + '</div>'
                    + '</div>'
                    + '<div class="weui-cell item-time">'
                    + '<div class="weui-cell__bd">'
                    + '共' + e.number + '单，合计' + e.sum + '瓶，总金额：' + (e.total / 100) + '元'
                    + '</div>'
                    + '</div>'
                    + '</div>'
            });
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
            url: 'dealers/mgr',
            data: data,
            ok: function (res) {
                var info = res.data;
                if (!info.list.length) {
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
                yqd.showTab();
                $(".dealers-order").removeClass('hide');
            }
        })
    },

    //加载更多数据
    onMore: function () {
        var _this = this, _thisData = this.data;
        yqd.loadmore({
            selector: '#panel',
            callback: function () {
                _thisData.p += 1;
                _this.getList('more')
            }
        });
    },


    init: function () {
        this.getList('refresh');
        this.onMore();

    }
};
dealers.init();