'use strict';
var params = spa.getParam().query,
  msg = params ? params.msg : 'Mua~亲请重新扫码';
yqd.queryAt('.err-msg').innerText = msg;
