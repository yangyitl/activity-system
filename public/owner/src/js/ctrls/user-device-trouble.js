'use strict';
var trouble = {
  data: {
    reason: [],
    reasonType: null,
  },

  // 获取类型
  onShow: function() {
    var _thisData = this.data;
    yqd.request({
      type: 'POST',
      url: 'AliPayMer/Client/getErrorType',
      ok: function(res) {
        console.log(res.data)
        _thisData.reason = res.data.type;
      }
    })
  },

  // 选择类型
  onType: function() {
    var _thisData = this.data;
    yqd.queryAt('#onType', function(e) {
      weui.picker(_thisData.reason, {
        onConfirm: function (res) {
          console.log(res)
          yqd.queryAt('#typeText').value = res[0].label;
          _thisData.reasonType = res[0].value
        },
        id: 'picker'
      })
    })
  },

  // 提交故障
  onSubmit: function() {
    var _thisData = this.data;
    yqd.queryAt('#onSubmit', function(e) {
      var type = _thisData.reasonType,
        desc = yqd.queryAt('#desc').value;
      if (!type) {
        yqd.toast({ content: '请选择故障类型' }); return;

      } else if (desc && !yqd.regEx('CONTENT', desc)) {
        yqd.toast({ content: '故障描述含有敏感字符' }); return;

      } else {
        yqd.request({
          loader: '提交中',
          type: 'POST',
          url: 'AliPayMer/Client/reportFault',
          data: {
            typeId: type,
            remark: desc
          },
          ok: function(res) {
            yqd.toast({
              content: '已提交',
              type: 'success',
              callback: function() {
                spa.replaceGo('userDeviceMgr')
              }
            })
          }
        })
      }
    })
  },

  init: function() {
    this.onShow();
    this.onType();
    this.onSubmit();
  }
}
trouble.init();