'use strict';
var order = {
  data: {
    tab: 0,
    tags: ['今日', '昨日',  '本周',  '本月',  '历史'],
    p: 1,
    size: 20,
    type: 0,
    sTime: '',
    eTime: '',
    listTotal: 0
  },

  // 渲染列表
  renderList: function(listData) {
    if (listData.length) {
      var status, statusClass, content = '';
      listData.forEach(function(e, i) {
        status = e.status ? '入账成功' : '待入账';
        statusClass = e.status ? 'item-success' : 'item-warn';
        content += '<div class="list-cells">'
          + '<div class="weui-cell item-time">'
          +   '<div class="weui-cell__bd">订单号：'+ e.order_sn +'</div>'
          + '</div>'
          + '<div class="weui-cell">'
          +   '<div class="weui-cell__bd">订单金额</div>'
          +   '<div class="weui-cell__ft">'+ e.merchant_fee +'</div>'
          + '</div>'
          + '<div class="weui-cell">'
          +   '<div class="weui-cell__bd">订单状态</div>'
          +   '<div class="weui-cell__ft '+ statusClass +'">'+ status +'</div>'
          + '</div>'
          + '<div class="weui-cell">'
          +   '<div class="weui-cell__bd">交易时间</div>'
          +   '<div class="weui-cell__ft item-time">'+ e.created_at +'</div>'
          + '</div>'
          +'</div>'
      });
      return content
    }
  },

  // 获取列表数据
  getList: function(type) {
    var _this = this, _thisData = this.data,
      data = {
        orderType: _thisData.tab,
        p: _thisData.p,
        size: _thisData.size,
        type: _thisData.type,
        sTime: _thisData.sTime,
        eTime: _thisData.eTime,
      };
    if (_thisData.type) {
      delete data['sTime'];
      delete data['eTime'];
    } else {
      delete data['type'];
    }
    yqd.request({
      type: 'POST',
      url: 'AliPayMer/Order/lists',
      data: data,
      ok: function(res) {
        console.log(res)
        var info = res.data,
          listWrp = yqd.queryAt('#listWrp'),
          listCells = document.querySelector('#listCells');
        if (!info.lists.length) {
          listCells ? listWrp.removeChild(listCells) : null;
          yqd.queryAt('#listTip').classList.remove('hide');

        } else {
          yqd.queryAt('#income').innerText = info.income;
          yqd.queryAt('#listTip').classList.add('hide');
          _thisData.listTotal = info.totalNumber;
          switch(type) {
            // 刷新或重置列表
            case 'refresh':
              var content = _this.renderList(info.lists),
                list = document.createElement('div');
              list.setAttribute('id', 'listCells');
              list.innerHTML = content;
              listCells ? listWrp.removeChild(listCells) : null;
              listWrp.appendChild(list)
            break;

            //加载更多
            case 'more':
              var content = _this.renderList(info.lists);
              listCells.innerHTML += content;
            break;
          }
        }
      }
    })
  },

  // 加载更多数据
  onMore: function() {
    var _this = this, _thisData = this.data;
    yqd.loadmore({
      selector: '#panel',
      callback: function() {
        if (_thisData.p * _thisData.size > _thisData.listTotal) {
          yqd.toast({ content: '没有更多内容了~' })

        } else {
          _thisData.p += 1;
          _this.getList('more')
        }
      }
    })
  },

  // 切换tab
  switchTab: function() {
    var _this = this;
    weui.tab('#tab', {
      defaultIndex: 0,
      onChange: function(idx){
        // 切换tab的时候初始化所有配置，并重新渲染对应的tab数据
        _this.data = Object.assign(_this.data, {
          tab: idx,
          p: 1,
          type: 0
        });
        _this.onShow()
      }
    });
  },

  // 渲染时间标签
  renderTag: function() {
    var tags = '', active;
    this.data.tags.forEach(function(e, i) {
      active = !i ? 'active': '';
      tags += '<span class="hd-item '+ active +'" data-idx="'+ i +'">'+ e +'</span>'
    });
    yqd.queryAt('#TagWrp').innerHTML = tags;
  },

  // 标签选择
  switchTag: function() {
    var _this = this;
    yqd.queryOn('.hd-item', 'click', function(e) {
      var dataset = e.target.dataset,
        idx = dataset.idx, type = Number(idx) + 1;
      yqd.queryOn('.hd-item', function(node, i) {
        idx == i ? node.classList.add('active') : node.classList.remove('active')
      });
      yqd.queryAt('#sTime').innerText = '--';
      yqd.queryAt('#eTime').innerText = '--';
      _this.data = Object.assign(_this.data, {
        p: 1,
        type: type,
        sTime: '',
        eTime: ''
      });
      _this.getList('refresh');
    })
  },

  // 时间选择
  onTime: function(e) {
    var _this = this;
    yqd.queryOn('.navigate', 'click', function(e) {
      var id = e.target.dataset.id;
      weui.datePicker({
        start: 2019,
        end: new Date().getFullYear() + 20,
        onConfirm: function(res){
          var year = res[0].value,
            month = res[1].value < 10 ? '0'+ res[1].value : res[1].value,
            day = res[2].value < 10 ? '0'+ res[2].value : res[2].value,
            time = year +'-'+ month +'-'+ day,
            timestamp = Math.round(new Date(year +'/'+ month +'/'+ day).getTime()/1000);
          switch(id) {
            case 'sTime':
              // 如果已存在结束时间
              if (_this.data.eTime) {
                if (timestamp > _this.data.eTime) {
                  yqd.toast({ content: '开始时间不能晚于结束时间' })

                } else {
                  // 如果选择时间就去掉标签的激活状态，初始化部分配置
                  yqd.queryOn('.hd-item', function(node, i) { node.classList.remove('active') });
                  yqd.queryAt('#'+ id).innerText = time;
                  _this.data = Object.assign(_this.data, {
                    p: 1,
                    type: 0,
                    [id]: timestamp
                  });
                  _this.getList('refresh')
                }

              } else {
                // 如果不存在结束时间
                yqd.queryOn('.hd-item', function(node, i) { node.classList.remove('active') });
                yqd.queryAt('#'+ id).innerText = time;
                _this.data = Object.assign(_this.data, {
                  p: 1,
                  type: 0,
                  [id]: timestamp
                });
              }
            break;
            case 'eTime':
              if (!_this.data.sTime) {
                yqd.toast({ content: '请先选择开始时间' })

              } else {
                if (timestamp < _this.data.sTime) {
                  yqd.toast({ content: '结束时间不能早于开始时间' })

                } else {
                  yqd.queryOn('.hd-item', function(node, i) { node.classList.remove('active') });
                  yqd.queryAt('#'+ id).innerText = time;
                  _this.data = Object.assign(_this.data, {
                    p: 1,
                    type: 0,
                    [id]: timestamp
                  });
                  _this.getList('refresh')
                }
              }
            break;
          }
        },
        id: 'picker'
      })
    })
  },

  // 初始化渲染时间和列表
  onShow: function() {
    var DATE = new Date(),
      month = DATE.getMonth() < 10 ? '0'+ (DATE.getMonth() + 1) : (DATE.getMonth() + 1),
      day = DATE.getDate() < 10 ? '0'+ DATE.getDate() : DATE.getDate(),
      time = DATE.getFullYear() +'-'+ month +'-'+ day,
      timestamp = Math.round(new Date(DATE.getFullYear() +'/'+ month +'/'+ day).getTime()/1000);
    yqd.queryAt('#sTime').innerText = time;
    yqd.queryAt('#eTime').innerText = time;
    this.data.sTime = this.data.eTime = timestamp;
    // 初始化标签与监听标签
    this.renderTag();
    this.switchTag();
    // 初始化渲染数据
    this.getList('refresh')
  },

  init: function() {
    this.onShow();
    this.switchTab();
    this.onTime();
    this.onMore();
  }
}
order.init();