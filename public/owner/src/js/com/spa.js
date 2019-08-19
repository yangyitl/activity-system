/*!
 * @version = 2.0.9
 * @作者: AaronYeung
 * @日期: update on 2019-03-05
 * @备注: SPA框架 - BY HASH API
 * 1.URL去除'index.html'后缀模式
 * 2.精简并优化代码
 * 3.修复bug
 * 4.修改getParam方法中value字段为query
 */
!function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) : (global.Spa = factory());

}(this, (function() {

  /* forEach遍历数组兼容
	 *
	 * @callback {function} 回调函数
	 * */
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(callback) {
			if (typeof callback !== 'function') throw new TypeError();
			// IE6-8下自己编写回调函数执行的逻辑
			// context为callback 函数的执行上下文环境
			var context = arguments[1];
			for(var i = 0, len = this.length; i < len; i++) {
				// callback函数接收三个参数：当前项的值、当前项的索引和数组本身
				callback && callback.call(context, this[i], i, this);
			}
		}
	}

	/** spa **/
	function Spa() {};
	Spa.prototype = {

		/* 设置初始化参数
     *
     * @config.view {string}  展示view视图的div选择器具，为id或class
     * @config.errTemp {string}  可选的错误模板选择器，所跳转路由不存在的时候展示的错误模板，为id或class
     *
     * @config.router {object] 路由配置对象，配置所有的路由信息和所加载的对应html模板和js，'default' 用来设置默认路由，即不在路由规则里面的路由将展示 'default' 的view视图内容，如router: {'index': {template: '../view/about.html', controller: '../js/app/home.js'}, ...}
     * @config.router.routerName {object} routerName路由名，如：'home'，是一个路由信息对象
     * @config.router.routerName.title {string} 路由页面标题
     * @config.router.routerName.template {string} 路由页面html模板url路径
     * @config.router.routerName.controller {array} 路由页面对应对css/js文件路径数组，为了避免出现引用顺序造成的问题，建议按照页面css和js的引用顺序填写数组
     *
     * @config.default {object}  默认初始化首次加载的路由信息对象，在未找到匹配config.router里面对任何一个路由对时候也会使用这个默认路由
     * @config.default.name {string} 默认路由名
     * @config.default.title {string} 默认路由页面标题
     * @config.default.template {string} 默认路由页面html文件路径
     * @config.default.controller {array} 默认路由需要加载的css/js文件路径
     *
     * usage:
     * spa.init({
     *   view: '#ui-view',
     *   errTemp: '#error', // 可选
     *   router: {
     *		'home': {
     *			title: '首页',
     *			template: 'views/home.html',
     *			controller: ['css/app/home.css', 'js/app/home.js']
     *		},
     *		'content': {
     *			title: '内容',
     *			template: 'views/content.html',
     *			controller: ['css/app/content.css','js/app/content.js']
     *		},
     *		'contact': {
     *			title: '联系',
     *			template: 'views/contact.html',
     *			controller: ['css/app/contact.css', 'js/app/contact.js']
     *		}
     *	},
     *	default: {  // 默认路由
     *		name: 'home',  // 默认理由名称，也是默认路由hash
     * 		title: '首页'
     * 		template: 'views/home.html',
     *		controller: ['css/app/home.css', 'js/app/home.js']
     *	}
     * });
     * */
		init: function(config) {
			var _this = this;
			this.view = config.view;
			this.errTemp = config.errTemp;
      this.router = config.router;
      this.default = config.default;
      this.initRouter();
      window.onhashchange = function() {
        _this.initRouter();
      };
		},

		/* 指定路由跳转
     *
     * @hashName {string}  某个页面路由名称，比如 'index'、'about'
     *
     * */
		go: function(hashName) {
      hashName.indexOf('!/') != -1 ? location.hash = hashName : location.hash = '!/'+ hashName;
		},

		/* 指定路由跳转,替换掉历史url
     *
     * @hashName [string]  某个页面路由名称，比如 'index'、'about'
     *
     * */
		replaceGo: function(hashName) {
      hashName.indexOf('#!/') != -1 ? location.replace(hashName) : location.replace('#!/'+ hashName);
		},

		/* 主动获取当前路由名称  */
		watchHash: function() {
			var hash = location.hash,
				index = hash.indexOf('?'),
				hashName = index > -1 ? hash.substring(3, index) : hash.substring(3);
			return hashName;
		},

		/* 监听路由发生变化并执行可用回调函数
     *
     * @callback {string}  回调函数名称
     *
     * */
		onhashChange: function(callback) {
			window.addEventListener('hashchange', function() {
				if (typeof callback !== 'function') {
          throw new TypeError('the param =>'+ callback +' not a function');

				} else callback();
			});
		},

		/* 设置页面title
     *
     * @title {string}  某个页面路由配置信息，比如 'index'、'about'
     *
     * */
    setTitle: function(title) {
      typeof title === 'string' ? document.title = title : document.title = this.default.title;
    },

		/* 设置路由参数：#!/index?status=1&..
     *
     * @hashName {string}  某个页面路由配置信息，即将要设置参数的页面路由名称，比如 'index'、'about'
     * @param {object} 需要传递的参数，即暴露在url后的参数，一个对象类型的值，如{status: 1, name: Aaron}
     *
     * */
		setParam: function(hashName, param){
      var paramStr = '', hash;
      if (Object.prototype.toString.call(param) !== '[object Object]') {
        throw new TypeError('the second param => '+ param +' not an object');

      } else {
        for (var i in param) {
          paramStr += i +'='+ encodeURIComponent(param[i]) +'&';
        }
        if (paramStr === '') {
          hash = '!/'+ hashName;
        } else {
          paramStr = paramStr.substring(0, paramStr.length-1);
          hash = '!/'+ hashName +'?'+ paramStr;
        }
        return hash;
      }
		},

		/* 获取由setParam设置的路由参数：#!/index?status=1&..
     *
     * @hashStr {string}  可选，hashStr —— 完整的hash串，比如#!/home?name=Jack&age=18 .如果参数为空，默认取当前浏览器的hash，
     * 初始化或者每次切换路由的时候hashStrl为必选，在initRouter()方法中已经自动传入
     * 如果为单纯的页面获取有setParam设置的参数的时候无需传参，直接spa.getParam()即可
     *
     * */
		getParam: function(hashStr) {
			// 使用hash '#!/'
			// 当输入到index.html或输入到路径进来页面的话，此时得到到hashStr都是为空，即''，故typeof hashStr === 'string'
			var hash = typeof hashStr === 'undefined' ? location.hash : hashStr,
        pIndex = hash.indexOf('?'),  // 判断参数问号在hash中出现的索引
        param = {
          hashName: null,
          query: {}
        };
      if (hash === '') return param;  // 如果hashStr为空，则hash为空，直接返回空参数
      if (pIndex != -1) {  // 如果问号索引大于-1，则说明存在参数
        var paramStr = hash.substring(pIndex + 1),   // 参数字符串
          paramArr = paramStr.split('&');            // 将参数字符串转换成数组
        param.hashName = hash.substring(3, pIndex);  // 存储hashName

        paramArr.forEach(function(each, i, e) {  // 遍历参数数组，转成参数对象放入param.value中
          var item = each.split('='), key, val;
          key = item[0];
          val = item[1];
          param.query[key] = key ? decodeURIComponent(val) : null;
        });

      } else {
        param.hashName = hash.substring(3);
        param.query = {};
      }
      return param;
		},

		/* 用来存储页面之间需要的值，类似cookie,用作内存传参，在不能暴露参数的场景
     *
     * @param {object}
     * // 隐式向 home 页面传递参数
		 *	var param = {
		 *	    'key': 'home_msg',
		 *	    'value': {
		 *	    	name: "Jack",
		 *			  age:"18"
		 *	     }
		 *	};
		 *	spa.setStorage(param);
		 *	spa.go('home');
		 *  id  内存传参的唯一id，用作识别想哪个页面或者为需要传参的页面做标识，方便获取对应页面的参数
     *
     * */
		setStorage: function(param) {
			if (!Storage && Object.prototype.toString.call(param) !== '[object Object]') {
        throw new TypeError('not support Storage or the param =>'+ param +' not an object, did not set sessionStorage');

			} else {
				if (sessionStorage.storageStack) {  // 如果存在storageStack缓存
          var storageStack = JSON.parse(sessionStorage.storageStack);
          if (storageStack[param.key]) {  // 判断storageStack是否存在对应param中的key，如果存在则更新或添加storageStack对应key的值
            for (var k in param.value) {
              storageStack[param.key][k] = param.value[k];
            }
          } else {  // 如果storageStack中不存在对应param中的key，则直接在storageStack中添加key并赋值
            storageStack[param.key] = param.value;
          }
          sessionStorage.storageStack = JSON.stringify(storageStack);

        } else {  // 如果不存在storageStack缓存
          var storageStack = {};
          storageStack[param.key] = param.value;
          sessionStorage.storageStack = JSON.stringify(storageStack);
        }
			}
		},

		/* 获取由setStorage设置的路由参数
     *
     * @key {string}  内存传参的唯一key, setStorage中设置的key
     * var param = spa.getStorage('home_msg');
     *
     * */
		getStorage: function(key) {
			if (!Storage) {
        throw new Error('not support Storage');

			} else {
        var param = sessionStorage.storageStack ? JSON.parse(sessionStorage.storageStack)[key] : null;
        return param;
			}
		},

		/* 删除由setStorage设置的路由参数
     *
     * @key {string}  内存传参的唯一key, setStorage中设置的key
     *
     * */
		delStorage: function(key) {
			if (!Storage) {
        throw new Error('not support Storage');

			} else {
        if (sessionStorage.storageStack) {
          throw new Error('has not any Storage');

        } else {
          var storageStack = JSON.parse(sessionStorage.storageStack);
          delete storageStack[key];
          sessionStorage.storageStack = JSON.stringify(storageStack);
        }
			}
		},

		/* 清除所有由setStorage设置的路由参数 */
		clearStorage: function() {
			if (!Storage) {
				throw new Error('not support Storage');
			} else {
        sessionStorage.clear();
			}
		},

		/* 加载页面css/js文件
     *
     * @pathArr {array}  css/js文件路径数组
     * 考虑到页面所需文件加载顺序可能对页面布局或逻辑js有影响而产生提示方法undefined或错误等问题，
     * 故建议页面逻辑样式css文件或逻辑js文件放在最后，css和js分组，css在前，js在后，
     * 如：['common1.css', 'common2.css', 'page.css', 'common1.js', 'common2.js', 'page.js'],
     * 或如：['common1.css', 'common2.css', 'common1.js', 'common2.js', 'page.css', 'page.js'],
     *
     * @callback {function} 可选，加载成功后执行的回调函数
     *
     * */
		loadFiles: function(pathArr, callback) {
			pathArr.forEach(function(item, i, e) {
				if (item.search(/\.css(\?v=[a-zA-Z\d]+)?$/) != -1) {
					var head = document.head || document.getElementsByTagName('head')[0];
					var links = head.getElementsByTagName('link'), isloaded = false;
					if (!links || links.length === 0) {
						creatLink(item);
					} else {
						for (var i = 0, len = links.length; i < len; i++) {
							if (links[i].href.indexOf(item) != -1) {
								isloaded = true;
								return;
							}
						}
						if (!isloaded) creatLink(item);
					}
					function creatLink(url) {
						var link = document.createElement('link');
						link.rel = 'stylesheet';
						link.href = url;
						head.appendChild(link);
					}

				} else if (item.search(/\.js(\?v=[a-zA-Z\d]+)?$/) != -1) {
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.onload = script.onreadystatechange = function() {
						if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
							callback && callback();
							document.body.removeChild(script);
							script.onload = script.onreadystatechange = null;
						}
					}
					script.src = item;
					// 为了避免页面逻辑js文件在部分功能或插件js文件未加载时提前加载而引起某些函数方法提示错误或者提示...is undefined的情况，需要延迟加载页面逻辑js文件
					// 如果当前遍历到的item不是pathArr中最后一个，则直接加载，否则延迟加载该js文件
					item !== pathArr[pathArr.length-1] ? document.body.appendChild(script) : setTimeout(function() {
						document.body.appendChild(script);
					}, 300);
				}
			});
		},

		/*初始化进入，或每次切换路由加载html模板和js*/
		initRouter: function() {
			var _this = this,
        uri = location.href,
        hashStr = location.hash,  // 获取每次页面加载的路由hash值
        hashName = this.getParam(hashStr).hashName,  // this.getParam(hashStr)获取需要跳转到的路由配置参数对象，主要是通过参数对象获取每次要跳转的hashName
        routerInfo = this.router[hashName];  // 获取到需要跳转的页面路由对象信息/页面模版和css/js等
      if (typeof routerInfo === 'undefined') {  // 如果在router里面找不到匹配对路由信息，则使用默认路由
        routerInfo = this.default;  // 把默认路由对象的信息赋值给routerHash
        // 如果获取到的路由为空或者undefined则跳转到默认路由，
        // 判断如果为url输入到http:// ..../index.html进来的，为了美观，则裁掉index，隐藏掉index在进入路由页面
        // 否则直接进入路由页面
        uri.indexOf('index') != -1 ? location.replace(uri.split('index')[0] +'#!/'+ routerInfo.name) : location.hash = '!/'+ routerInfo.name;
        return false;

      } else {
        // 如果index存在hash参数等
        if (uri.indexOf('index') != -1) {
          var uriArr = uri.split('index.html');
          location.replace(uriArr[0] + uriArr[1]);
        }
      }
      // get template
      var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
      xhr.open('GET', routerInfo.template);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          !routerInfo.title || typeof routerInfo.title === 'undefined' ? document.title = _this.default.title : document.title = routerInfo.title;
          document.querySelector(_this.view).scrollTop = 0;  // 页面切换时恢复视图滚回顶部
          document.querySelector(_this.view).innerHTML = xhr.responseText;
          if (routerInfo.controller && routerInfo.controller.length) {
            _this.loadFiles(routerInfo.controller); // get template's css and js
          }
        } else {
          var errTemp = document.querySelector(_this.errTemp);
          if (errTemp === null || errTemp.length === 0) {
            return;
          } else {
            var errHtml = errTemp.innerHTML;
            errHtml = errHtml.replace(/{{errStatus}}/, 'status:'+ xhr.status);
            errHtml = errHtml.replace(/{{errContent}}/, 'response:'+ xhr.responseText);
            document.querySelector(_this.view).innerHTML = errHtml;
          }
        }
      }
      xhr.send();
		}
	}
  return Spa;

}));

typeof window !== 'undefined' && window.Spa ? window.SPA = window.Spa : null;
// 注册全局spa方便使用，也可以通过构造函数单独实例化Spa, 如：var spa = new Spa;/var spa = new SPA;
typeof window !== 'undefined' && window.Spa ? window.spa = new Spa : null;