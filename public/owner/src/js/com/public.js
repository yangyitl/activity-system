/*!
 * @version = 1.0.0
 * @作者: AaronYeung
 * @日期: update on 2018-12-28
 * @备注: adv for mobile
 *
 */
!function () {
    "use strict";

    function t(e, o) {
        function i(t, e) {
            return function () {
                return t.apply(e, arguments)
            }
        }

        var r;
        if (o = o || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = o.touchBoundary || 10, this.layer = e, this.tapDelay = o.tapDelay || 200, this.tapTimeout = o.tapTimeout || 700, !t.notNeeded(e)) {
            for (var a = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], c = this, s = 0, u = a.length; u > s; s++) c[a[s]] = i(c[a[s]], c);
            n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function (t, n, o) {
                var i = Node.prototype.removeEventListener;
                "click" === t ? i.call(e, t, n.hijacked || n, o) : i.call(e, t, n, o)
            }, e.addEventListener = function (t, n, o) {
                var i = Node.prototype.addEventListener;
                "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function (t) {
                    t.propagationStopped || n(t)
                }), o) : i.call(e, t, n, o)
            }), "function" == typeof e.onclick && (r = e.onclick, e.addEventListener("click", function (t) {
                r(t)
            }, !1), e.onclick = null)
        }
    }

    var e = navigator.userAgent.indexOf("Windows Phone") >= 0, n = navigator.userAgent.indexOf("Android") > 0 && !e,
        o = /iP(ad|hone|od)/.test(navigator.userAgent) && !e, i = o && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        r = o && /OS [6-7]_\d/.test(navigator.userAgent), a = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function (t) {
        switch (t.nodeName.toLowerCase()) {
            case"button":
            case"select":
            case"textarea":
                if (t.disabled) return !0;
                break;
            case"input":
                if (o && "file" === t.type || t.disabled) return !0;
                break;
            case"label":
            case"iframe":
            case"video":
                return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }, t.prototype.needsFocus = function (t) {
        switch (t.nodeName.toLowerCase()) {
            case"textarea":
                return !0;
            case"select":
                return !n;
            case"input":
                switch (t.type) {
                    case"button":
                    case"checkbox":
                    case"file":
                    case"image":
                    case"radio":
                    case"submit":
                        return !1
                }
                return !t.disabled && !t.readOnly;
            default:
                return /\bneedsfocus\b/.test(t.className)
        }
    }, t.prototype.sendClick = function (t, e) {
        var n, o;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(), o = e.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
    }, t.prototype.determineEventType = function (t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }, t.prototype.focus = function (t) {
        var e;
        o && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
    }, t.prototype.updateScrollParent = function (t) {
        var e, n;
        if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n, t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }, t.prototype.getTargetElementFromEventTarget = function (t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }, t.prototype.onTouchStart = function (t) {
        var e, n, r;
        if (t.targetTouches.length > 1) return !0;
        if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], o) {
            if (r = window.getSelection(), r.rangeCount && !r.isCollapsed) return !0;
            if (!i) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
                this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
    }, t.prototype.touchHasMoved = function (t) {
        var e = t.changedTouches[0], n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n ? !0 : !1
    }, t.prototype.onTouchMove = function (t) {
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
    }, t.prototype.findControl = function (t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, t.prototype.onTouchEnd = function (t) {
        var e, a, c, s, u, l = this.targetElement;
        if (!this.trackingClick) return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (u = t.changedTouches[0], l = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || l, l.fastClickScrollParent = this.targetElement.fastClickScrollParent), c = l.tagName.toLowerCase(), "label" === c) {
            if (e = this.findControl(l)) {
                if (this.focus(l), n) return !1;
                l = e
            }
        } else if (this.needsFocus(l)) return t.timeStamp - a > 100 || o && window.top !== window && "input" === c ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), o && "select" === c || (this.targetElement = null, t.preventDefault()), !1);
        return o && !i && (s = l.fastClickScrollParent, s && s.fastClickLastScrollTop !== s.scrollTop) ? !0 : (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1)
    }, t.prototype.onTouchCancel = function () {
        this.trackingClick = !1, this.targetElement = null
    }, t.prototype.onMouse = function (t) {
        return this.targetElement ? t.forwardedTouchEvent ? !0 : t.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1) : !0 : !0
    }, t.prototype.onClick = function (t) {
        var e;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail ? !0 : (e = this.onMouse(t), e || (this.targetElement = null), e)
    }, t.prototype.destroy = function () {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, t.notNeeded = function (t) {
        var e, o, i, r;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (o = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n) return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
                if (o > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
            }
        }
        if (a && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), i[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction ? !0 : (r = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], r >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === t.style.touchAction || "manipulation" === t.style.touchAction ? !0 : !1)
    }, t.attach = function (e, n) {
        return new t(e, n)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}();
!function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (global.Yqd = factory());

}(this, (function () {

    /* forEach遍历数组兼容
     *
     * @callback {function} 回调函数
     * */
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback) {
            if (typeof callback !== 'function') throw new TypeError();
            //IE6-8下自己编写回调函数执行的逻辑
            // context为callback 函数的执行上下文环境
            var context = arguments[1];
            for (var i = 0, len = this.length; i < len; i++) {
                // callback函数接收三个参数：当前项的值、当前项的索引和数组本身
                callback && callback.call(context, this[i], i, this);
            }
        }
    }


    /** Yqd **/
    function Yqd() {
        // constant
        this.domain = window.location.protocol + "/",
            this.rootPath = window.location.protocol + '/use/',
            this.webPath = window.location.protocol + '/owner/',

        // this.domain = 'http://md.fundidi.com/',
        //     this.rootPath = 'http://md.fundidi.com/use/',
        //     this.webPath = 'http://md.fundidi.com/owner/',

            this.mapKey = 'XKEBZ-E2ERK-UPMJV-AVVQO-6IBNE-LFB4S',
            this.appName = 'TiBox',
            this.mapSearch = function (backurl) {
                return 'https://apis.map.qq.com/tools/locpicker?search=1&type=0&backurl=' + backurl + '&mapdraggable=0&coordtype=1&key=' + this.mapKey + '&referer=' + this.appName;
            },

            this.regEx = function (type, content) {
                var reg;
                if (typeof type !== 'string') {
                    throw new Error('the argument => "type" is undefined or not string when usage regEx')

                } else {
                    switch (type) {
                        case 'NAME':
                            reg = /^[\u4e00-\u9fa5]{1,6}$/
                            break;
                        case 'PHONE':
                            reg = /^1(3|4|5|6|7|8|9)\d{9}$/
                            break;
                        case 'NUM':
                            reg = /^([0-9]*)|(\d*)$/
                            break;
                        case 'MONEY':
                            reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                            break;
                        case 'CONTENT':
                            reg = /^[\u4e00-\u9fa5_a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]*$/
                            break;
                    }
                    if (typeof content === 'undefined') return reg;
                    else return reg.test(content);
                }
            },


            /** toast
             * @ops {object} 配置对象
             * @ops.content {string} 提示文字
             * @ops.type {string} 图标类型
             * @ops.callback {function} 按钮回调
             */
            this.toast = function (ops) {
                if (Object.prototype.toString.call(ops) === '[object Object]') {
                    ap.showToast({
                        content: ops.content || '',
                        type: ops.type || 'none'

                    }, function () {
                        ops.callback && ops.callback()
                    })

                } else throw new Error('param => ' + ops + ' not an object or undefined');
            },

            /** alert弹框
             * @ops {object} 配置对象
             * @ops.title {string} 提示标题
             * @ops.content {string} 提示文字
             * @ops.callback {function} 按钮回调
             */
            this.alert = function (ops) {
                if (Object.prototype.toString.call(ops) === '[object Object]') {
                    $.alert({
                        title: ops.title || '',
                        content: ops.content || '',
                        buttonText: ops.okText || '我知道了'

                    }, function () {
                        ops.callback && ops.callback();
                    })

                } else console.log('param => ' + ops + ' not an object or undefined');
            },

            /** confirm弹框
             * @ops {object} 配置对象
             * @ops.title {string} 提示标题
             * @ops.content {string} 提示文字
             * @ops.okText {string} 确定按钮文字
             * @ops.failText {string} 取消按钮文字
             * @ops.callback {function} 按钮回调
             */
            this.confirm = function (ops) {
                if (Object.prototype.toString.call(ops) === '[object Object]') {
                    ap.confirm({
                        title: ops.title || '',
                        content: ops.content || '',
                        confirmButtonText: ops.okText || '我知道了',
                        cancelButtonText: ops.failText || '取消'

                    }, function (res) {
                        ops.callback && ops.callback(res);
                    })

                } else throw new Error('param => ' + ops + ' not an object or undefined');
            },

            /** loadmore 上拉加载
             * @ops {object} 配置对象
             * @ops.selector {string} 指定监听滚动的容器，可选
             * @ops.callback {function} 上拉加载触发的回调
             */
            this.loadmore = function (ops) {
                if (Object.prototype.toString.call(ops) !== '[object Object]') {
                    throw new Error('param => ' + ops + ' not an object or undefined');
                } else {
                    var dElement = document.documentElement, dBody = document.body,
                        scrollTop = 0, clientHeight = 0, scrollHeight = 0;

                    // 非指定具体监听滚动的容器
                    if (!ops.selector || typeof ops.selector !== 'string') {
                        window.onscroll = function () {
                            // 获取滚动条滚动当前的位置（已滚动的高度）
                            if (dElement && dElement.scrollTop) {
                                scrollTop = dElement.scrollTop;

                            } else if (dBody) {
                                scrollTop = dBody.scrollTop;
                            }

                            // 获取当前可视范围（视窗）的高度
                            if (dElement.clientHeight && dBody.clientHeight) {
                                clientHeight = Math.min(dElement.clientHeight, dBody.clientHeight);

                            } else {
                                clientHeight = Math.max(dElement.clientHeight, dBody.clientHeight);
                            }

                            // 获取整个文档的完整高度
                            scrollHeight = Math.max(dElement.scrollHeight, dBody.scrollHeight);

                            // 当“滚动条高度+视窗高度=文档高度”时说明已经滚动到底部则出发加载更多
                            if (scrollTop + clientHeight == scrollHeight) {
                                ops.callback && ops.callback();
                            }
                        }

                    } else {
                        // 指定具体兼听的容器
                        var target = document.querySelector(ops.selector);
                        target.addEventListener('scroll', function (e) {
                            scrollTop = target.scrollTop;
                            clientHeight = target.clientHeight;
                            scrollHeight = target.scrollHeight;
                            // 当“滚动条高度+视窗高度=文档高度”时说明已经滚动到底部则出发加载更多
                            if (scrollTop + clientHeight == scrollHeight) {
                                ops.callback && ops.callback();
                            }
                        }, false);
                    }
                }
            },

            this.echoTime = function (idx = 0) {
                //获取当前时间
                var myDate = new Date();

                //获取当前时间(从1970.1.1开始的毫秒数,时间戳)
                console.log(idx + '--' + myDate.getTime());
            },
            /* 单独获取某一节点或单独为该节点绑定监听事件
             * 当传入的参数只有选择器的时候返回获取到的节点
             *
             * @selector {string} 节点的类或id选择器
             * @event {string} 监听的事件名称
             * @callback {function} 回调函数；
             * */
            this.queryAt = function (selector, event, callback) {
                if (!selector || typeof selector !== 'string') {
                    throw new TypeError('the param => ' + selector + ' undefined or not string');

                } else {
                    var node = document.querySelector(selector);
                    if (!node) {
                        throw new Error('not found the selector => ' + selector);

                    } else {
                        switch (typeof event) {
                            case 'string':
                                node.addEventListener(event, function (e) {
                                    callback && callback(e);
                                }, false);
                                break;

                            case 'function':
                                var eventName = typeof callback == 'string' ? callback : 'click';
                                node.addEventListener(eventName, function (e) {
                                    event(e);
                                }, false);
                                break;
                            default:
                                return node;
                                break;
                        }
                    }
                }
            },

            this.getRequest = function (url = null) {
                if (!url)
                    url = window.location.href; //获取url中"?"符后的字串

                if (!url) {
                    url = window.location.search;
                }
                if (url.indexOf("?") != -1) {
                    var theRequest = new Object();

                    var str = url.split('?');
                    strs = str[1].split("&");
                    console.log(strs);
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                    return theRequest;
                } else {
                    return false;
                }
            },

            /* 获取多节点并为每一个节点绑定监听事件
             * 当传入的参数只有选择器的时候返回遍历得到的每个节点
             *
             * @selector {string} 节点的类或id选择器
             * @event {string} 监听的事件名称
             * @callback {function} 回调函数；
             * */
            this.queryOn = function (selector, event, callback) {
                if (!selector || typeof selector !== 'string') {
                    throw new TypeError('the param => ' + selector + ' undefined or not string');

                } else {
                    var nodes = document.querySelectorAll(selector);
                    if (!nodes.length) {
                        throw new Error('not found the selector => ' + selector);
                    } else {
                        switch (typeof event) {
                            case 'string':
                                nodes.forEach(function (node, i) {
                                    node.addEventListener(event, function (e) {
                                        callback && callback(e);
                                    }, false);
                                });
                                break;

                            case 'function':
                                switch (typeof callback) {
                                    case 'string':
                                        var eventName = callback;
                                        callback = event;
                                        nodes.forEach(function (node, i) {
                                            node.addEventListener(eventName, function (e) {
                                                callback(e);
                                            }, false);
                                        });
                                        break;

                                    // 当传入的参数只有选择器和回调函数的时候返回遍历得到的每个节点
                                    default:
                                        nodes.forEach(function (node, i) {
                                            event(node, i);
                                        });
                                        break;
                                }
                                break;
                            default:
                                return nodes;
                                break;
                        }
                    }
                }
            },

            /* 获取多节点并为每一个节点绑定事件
             *
             * @selectors {array} 节点的类或id选择器数组
             * @callback {function} 回调函数；
             * */
            this.queryAll = function (selectors, callback) {
                if (!selectors || Object.prototype.toString.call(selectors) !== '[object Array]') {
                    throw new TypeError('the param => ' + selectors + ' undefined or not an array');

                } else {
                    selectors.forEach(function (e, i) {
                        var node = document.querySelector(e);
                        callback && callback(node, i);
                    });
                }
            },

            /* 公共请求
             *
             * @ops {object}             --参数对象
             * @ops.type {string}        --请求类型
             * @ops.url {string}         --请求的服务器url
             * @ops.jsonp {string}       --跨域请求拼接到url后面的参数名称，如url?jsonp=jsonpCallback
             * @ops.jsonpCallback {string}  --跨域请求的回调函数名称
             * @ops.data {object}        --请求发送的参数/数据
             * @ops.dataType {string}    --请求的数据类型
             * @ops.contentType {string} --请求头信息，用于POST请求，以设置默认值
             * @ops.ok {function}        --请求返回200后执行的回调函数
             * @ops.fail {function}      --请求返回400后执行的回调函数
             * @ops.handler {function}   --请求返回423后执行的回调函数,也可以定义其他status下的执行函数
             *
             * 跨域请求
             * yqd.request({
             *  url: 'https://apis.map.qq.com/ws/geocoder/v1/?location='+ encodeURI(latng) +'&key='+ encodeURI(yqd.mapkey),
             *  jsonp: 'callback',
             *  jsonpCallback: 'QQmap',
             *  data: { output: 'jsonp' },
             *  ok: function(res) {
             *    var locals = res.result.address_component,
             *      local = locals.province +','+ locals.city +','+ locals.district,
             *      addr = res.result.address;
             *    ...
             *  }
             * });
             * */
            this.hidedLoad = function () {
                yqd.queryAt('#loading').setAttribute('class', 'weui-loadmore all_loading hide');
            },
            this.showLoad = function () {
                yqd.queryAt('#loading').setAttribute('class', 'weui-loadmore all_loading');
            },

            this.request = function (ops) {
                if (Storage) {
                    // 如果ops为对象
                    switch (Object.prototype.toString.call(ops)) {
                        case '[object Object]':
                            // 如果配置了jsonp，则模拟跨域请求jsonp/jsonpCallback
                            this.showLoad();
                            var __this = this;
                            switch (typeof ops.jsonp) {
                                case 'string':
                                    __this.hidedLoad();
                                    var head = document.getElementsByTagName('head')[0],
                                        script = document.createElement('script'),
                                        callbackName = ops.jsonpCallback && typeof ops.jsonpCallback === 'string' ? ops.jsonpCallback : null;
                                    head.appendChild(script);

                                    // send request
                                    if (typeof ops.url !== 'string') {
                                        throw new Error('param ops.url undefined');
                                    } else {
                                        var url, path = ops.url.split('?')[0],
                                            data = ops.data || {};
                                        data[ops.jsonp] = callbackName;
                                        // 如果原来的请求url上存在携带的参数，则直接在url后面拼接新增的参数
                                        // 如果不存在，怎先取出原来url上可能存在的问号，在拼接新增的参数（避免双问号出现问题）
                                        url = ops.url.indexOf('?') != -1 ? ops.url + '&' + transData(data) : path + '?' + transData(data);
                                        script.src = url;
                                    }

                                    // request timeout
                                    if (typeof ops.timeout === 'number') {
                                        script.timer = setTimeout(function () {
                                            head.removeChild(script);
                                            window[callbackName] = null;
                                            ops.fail ? ops.fail({msg: '请求超时'}) : null;

                                        }, ops.timeout);
                                    }
                                    break;

                                default:


                                    // common ajax
                                    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

                                    xhr.open(ops.type || 'GET', this.rootPath + ops.url || '', ops.async || true);
                                    xhr.responseType = ops.dataType || 'json';
                                    xhr.setRequestHeader('Content-Type', ops.contentType || 'application/x-www-form-urlencoded;charset=UTF-8');
                                    xhr.send(transData(ops.data || null));

                                    xhr.onreadystatechange = function () {

                                        if (xhr.readyState == 4 && xhr.status == 200) {
                                            setTimeout(__this.hidedLoad(),1000)

                                            var type = xhr.getResponseHeader('Content-Type'), res;
                                            // xml
                                            if (type.indexOf('xml') != -1 && xhr.responseXML) {
                                                ops.ok ? ops.ok(xhr.responseXML) : null;
                                                // json
                                            } else if (type === 'application/json') {
                                                res = xhr.response;
                                                console.log(res);
                                                switch (res.status) {
                                                    case 200:
                                                        ops.ok && ops.ok(res);
                                                        break;
                                                    case 400:
                                                        ops.fail ? ops.fail(res) : $.alert(res.msg);
                                                        break;
                                                    // 授权
                                                    case 401:
                                                        spa.go('login');
                                                        break;
                                                    default:
                                                        ap.alert('无效响应-500');
                                                        break;
                                                }

                                                // other
                                            } else {
                                                res = xhr.response;
                                                switch (res.status) {
                                                    case 200:
                                                        ops.ok && ops.ok(res);
                                                        break;
                                                    case 400:
                                                        ops.fail ? ops.fail(res) : $.alert(res.msg);
                                                        break;
                                                    // 授权
                                                    case 401:
                                                        spa.go('login');
                                                        break;
                                                    default:
                                                        ap.alert('无效响应-500');
                                                        break;
                                                }
                                            }
                                        }
                                    }
                                    break;
                            }
                            break;
                        default:
                            throw new Error('param => ' + ops + ' not an object or undefined');
                            break;
                    }

                    // translate data format
                    function transData(param) {
                        if (Object.prototype.toString.call(param) === '[object Object]') {
                            var paramStr = '';
                            for (var i in param) {
                                paramStr += i + '=' + encodeURIComponent(param[i]) + '&';
                            }
                            paramStr = paramStr.substring(0, paramStr.length - 1);
                            return paramStr;

                        } else {
                            return param;
                            throw new Error('param => ' + param + ' not an object or undefined');
                        }
                    }
                }
            },

            // router config
            this.router = function () {
                spa.init({
                    view: '#view',
                    errTemp: '#error',
                    router: {
                        login: {
                            title: '登陆纪莱熙',
                            template: 'views/login.html',
                            controller: ['src/css/login.css?v=1906171721', 'src/js/ctrls/login.js?v=1906171721']
                        },
                        home: {
                            title: '纪莱熙',
                            template: 'views/home.html',
                            controller: ['src/css/home.css?v=1906171721', 'src/js/com/clipboard.min.js?v=18122904d', 'src/js/ctrls/home.js?v=1906171721']
                        },
                        order: {
                            title: '订单',
                            template: 'views/order.html',
                            controller: ['src/css/order.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/order.js?v=1906171721']
                        },
                        addOrder: {
                            title: '添加订单',
                            template: 'views/add-order.html',
                            controller: ['src/css/add-order.css?v=1906171721', 'src/js/ctrls/add-order.js?v=1906171721']
                        },
                        meOrder: {
                            title: '我的订单',
                            template: 'views/me-order.html',
                            controller: ['src/css/me-order.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/me-order.js?v=1906171721']
                        },
                        editOrder: {
                            title: '修改地址',
                            template: 'views/edit-order.html',
                            controller: ['src/css/edit-order.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/edit-order.js?v=1906171721']
                        },
                        dealers: {
                            title: '经销商订单',
                            template: 'views/dealers.html',
                            controller: ['src/css/dealers.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/dealers.js?v=1906171721']
                        },
                        dealersOrder: {
                            title: '经销商订单',
                            template: 'views/dealers-order.html',
                            controller: ['src/css/dealers-order.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/dealers-order.js?v=1906171721']
                        },
                        user: {
                            title: '设置',
                            template: 'views/user.html',
                            controller: ['src/css/user.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/user.js?v=1906171721']
                        },
                        pass: {
                            title: '设置密码',
                            template: 'views/user-pass.html',
                            controller: ['src/css/pass.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/user-pass.js?v=1906171721']
                        },
                        forgot: {
                            title: '忘记密码',
                            template: 'views/fpass.html',
                            controller: ['src/css/fpass.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/fpass.js?v=1906171721']
                        },
                        mgr: {
                            title: '信息状态',
                            template: 'views/order-mgr.html',
                            controller: ['src/css/mgr.css?v=1906171721', 'src/js/ui/weui.min.js?v=1906171721', 'src/js/ctrls/mgr.js?v=1906171721']
                        },
                        error: {
                            title: 'ERROR',
                            template: 'views/error.html',
                            controller: ['src/css/error.css?v=1906171721', 'src/js/ctrls/error.js?v=1906171721']
                        }
                    },
                    default: {
                        name: 'home',
                        title: '纪莱熙',
                        template: 'views/home.html',
                        controller: ['src/css/home.css?v=1906171721', 'src/js/com/clipboard.min.js?v=1906171721', 'src/js/ctrls/home.js?v=1906171721']
                    }
                });
            },


            this.hideTab = function () {
                yqd.queryAt('#navs').setAttribute('class', 'weui-tabbar hide');
            },
            this.showTab = function () {
                yqd.queryAt('#navs').setAttribute('class', 'weui-tabbar');
            },

            // 监听文档加载设置存储token和初始化配置与路由
            this.init = function () {
                var _this = this;
                // _this.tabUser();
                // _this.tabHome();
                if ('addEventListener' in document && Storage) {
                    document.addEventListener('DOMContentLoaded', function () {
                        var key = spa.getParam().query.key;
                        key ? localStorage.ctoken = key : null;
                        FastClick.attach(document.body);
                        ap.setNavigationBar({backgroundColor: '#574e5f'});
                        _this.router();
                    }, false);

                } else throw new Error('this browser not support "addEventListener" or "Storage"');
            }
    }

    return Yqd;

}));

typeof window !== 'undefined' && window.Yqd ? window.YQD = window.Yqd : null;
// 注册全局yqd方便使用，也可以通过构造函数单独实例化Yqd, 如：var yqd = new Yqd;/var yqd = new YQD;
typeof window !== 'undefined' && window.Yqd ? window.yqd = new Yqd : null;
yqd.init();
