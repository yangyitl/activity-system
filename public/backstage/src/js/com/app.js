/* ZM main app dependency */
(function () {
    'use strict';
    angular.module('zm', [
        'ngSanitize',
        'ui.router',
        'oc.lazyLoad',
        'ui.bootstrap',
        'cgNotify',
        'angular-sweetalert'
    ])
        .constant('$rootPath', window.location.protocol + '/man/')
        .constant('$rootVPath', window.location.protocol + '/man/')
        .constant('regEx', {
            //Chinese name and English name
            NAME: /^[\u4e00-\u9fa5]{1,6}$/,
            ENCH_NAME: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,

            //user name and password
            USER: /^([\u4E00-\uFA29\-]|[\uE7C7-\uE7F3\-]|[a-zA-Z0-9\-])*$/,
            PASS: /^\w*\.*$/,

            //telphone and mobile phone
            PHONE: /^1(3|4|5|6|7|8|9)\d{9}$/,
            TEL: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
            ALL_TEL: /^(1(3|4|5|6|7|8|9)\d{9})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14})$/,

            //number and personal ID
            NUM: /^\d*$/,
            EN_NUM: /^[a-zA-Z\d]+$/,
            BANK: /^\d{16,21}$/,
            ID: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,

            //money
            MONEY: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
            ALL_MONEY: /(^[0-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,

            //wechat and url
            WX_ACCOUNT: /^[a-zA-Z]{1}[a-zA-Z\d_-]{5,20}$/,
            WX_LINK: /^(http|https)?(:\/\/mp\.weixin\.qq\.com\/s\/)[^\s]+$/,
            URL: /^((http|https)?:\/\/)[^\s]+/,

            //content
            CONTENT: /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]*$/
        })
        //notify
        .run(function (notify) {
            notify.config({
                startTop: 50,
                maximumOpen: 1,
                duration: 3000
            });
        });
})();
// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad
