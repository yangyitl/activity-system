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
        sort: 0,
        id: 0,
        keywords: ''
    },
    //渲染列表
    renderList: function (listData) {
        console.log(this.data.sort);
        if (listData.length) {
            var disabled = '', content = '';

            listData.forEach(function (e, i) {
                content += '<tr><td class="w-30px">'
                    + '<input type="radio" ' + disabled
                    + ' data-id="' + e.id
                    + '"  value="' + e.id
                    + '" class="radio ' + disabled + '"></td>'
                    + '<td class="tr-text-decoration" data-type="0" data-id="' + e.id
                    + '">' + e.name
                    + '</td><td class="tr-text-account">' + e.account
                    + '</td><td class="tr-text-decoration" data-type="0" data-id="' + e.id
                    + '">' + e.submitAuditOrder
                    + '</td><td class="tr-text-decoration" data-type="1" data-id="' + e.id
                    + '">' + e.unAuditOrder
                    + '</td><td class="tr-text-decoration"  data-type="2" data-id="' + e.id
                    + '">' + e.auditOrder
                    + '</td></tr>'
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
                keywords: _thisData.keywords
            };

        yqd.request({
            type: 'POST',
            url: 'dealers/list',
            data: data,
            ok: function (res) {
                var info = res.data;
                if (!info.list.length) {
                    $.toptip('暂无订单', 'error');
                } else {
                    _thisData.listTotal = info.listTotal;
                    _thisData.id = info.userId;

                    switch (type) {
                        //刷新或重置列表
                        case'refresh':
                            $('#panel').html('');
                            var content = _this.renderList(info.list);

                            $('#panel').html(content);
                            break;
                        //加载更多
                        default:
                            var content = _this.renderList(info.list);
                            if (_thisData.p * _thisData.size < _thisData.listTotal) {
                                content += '<div id="weui-loadmore" class="weui-loadmore weui-loadmore_line">'
                                    + '<span class="weui-loadmore__tips">点击查看更多</span>'
                                    + '</div>';
                            } else {
                                content += '<div class="weui-loadmore weui-loadmore_line">'
                                    + '<span class="weui-loadmore__tips">人家也是有底线的</span>'
                                    + '</div>';
                            }
                            $('#panel').append(content);
                            break;
                    }
                    $('#more').html('');
                    if (_thisData.p * _thisData.size < _thisData.listTotal) {
                        var content = '<div id="weui-loadmore" class="weui-loadmore weui-loadmore_line">'
                            + '<span class="weui-loadmore__tips">点击查看更多</span>'
                            + '</div>';
                    } else {
                        var content = '<div class="weui-loadmore weui-loadmore_line">'
                            + '<span class="weui-loadmore__tips">人家也是有底线的</span>'
                            + '</div>';
                    }
                    $('#more').html(content);
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


    submit: function () {
        $("#panel").on('click', '.radio', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            } else {
                $(this).addClass('selected');
            }
        });
    },

    page: function () {
        var _this = this, _thisData = this.data;
        console.log(1);
        $("#dealers").on('click', '#weui-loadmore', function () {
            $(this).addClass('hide');
            _thisData.p += 1;
            _this.getList('more')
        })
    },

    allSubmit: function () {
        $(".radio-all").on('click', '.sele-button', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                $(".radio").removeClass('selected');
            } else {
                $(this).addClass('selected');
                $(".radio").addClass('selected');
            }
        });
    },

    search: function () {
        var _this = this, _thisData = this.data;
        $("#searchBar").on('change', '#searchInput', function () {
            _thisData.p = 1;
            _thisData.keywords = $("#searchInput").val();
            _this.getList('refresh');
        });
    },

    dealersSubmit: function () {
        $(".radio-all").on('click', '.dealers-button', function () {
            var array = [];
            $(".selected").each(function () {
                var id = $(this).attr('data-id');
                if (id && id != "undefined")
                    array.push(id);
            });
            if (array.length) {
                yqd.request({
                    type: 'POST',
                    url: 'dealers/submit',
                    data: {ids: array},
                    ok: function (res) {
                        $.toast('提交成功', function () {
                            location.reload();
                        });
                    }
                })
            }
        });
    },

    details: function () {
        $("#panel").on('click', '.tr-text-decoration', function () {
            var id = $(this).attr('data-id'),
                type = $(this).attr('data-type');
            spa.go('dealersOrder?id=' + id + '&tab=' + type);
        })
    },


    init: function () {
        this.getList('refresh');
        this.onMore();
        this.details();
        this.submit();
        this.allSubmit();
        this.dealersSubmit();
        this.search();
        this.page();

    }
};
dealers.init();