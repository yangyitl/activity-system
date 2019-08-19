'use strict';
var upload = {
  onUpload: function() {
    yqd.queryAll(['.item-wrp', '.item-tip'], function(n, i) {
      n.addEventListener('click', function(e) {
        var id = e.target.dataset;
        e.stopPropagation();
        ap.chooseImage(1, function(res) {
          console.log(res)
        })
      })
    })
  },

  init: function() {
    this.onUpload();
  }
}
upload.init();