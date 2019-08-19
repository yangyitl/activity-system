'use strict';
var mgr = {
  onShow: function() {
    yqd.request({
      type: 'POST',
      url: 'AliPayMer/Client/lists',
      ok: function(res) {
        console.log(res.data)
        var info = res.data;
        if (info) {
          yqd.queryAt('#code').innerText = info.qr_code;
          yqd.queryAt('#qrCode').src = info.qrCodeUrl || '';
          yqd.queryAt('#time').innerText = info.created_at;
          yqd.queryAt('#testTimes').innerText = info.check_number;
          yqd.queryAt('#workTimes').innerText = info.start_number;
          yqd.queryAt('#sign').innerText = info.connect;
          yqd.queryAll(['#qrCode', '#troubleBtn'], function(e, i) {
            e.classList.remove('hide');
          })
        }
      }
    })
  },

  // 预览二维码
  onPreview: function() {
    yqd.queryAt('#qrCode', 'click', function(e) {
      var img = e.target.src;
      console.log(img)
      ap.previewImage({
        urls: [img]
      })
    })
  },

  // 设备保障
  onTrouble: function() {
    yqd.queryAt('#troubleBtn', function(e) {
      spa.go('userDeviceTrouble');
    })
  },

  init: function() {
    this.onShow();
    this.onPreview();
    this.onTrouble();
  }
}
mgr.init();
