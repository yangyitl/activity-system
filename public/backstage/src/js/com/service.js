(function(){
	'use strict';
	var app = angular.module('zm');
	//menu data
	app.service('menuPromise', function($http, $q){
		return {
			menuData: function(){
				var defer = $q.defer();
				$http.get('src/json/menu.json').then(function success(response) {
					//接收成功后的数据
					defer.resolve(response);
				}, function error(response) {
					//接收失败后的数据
					defer.reject(response);
				});
				//返回一个数据对象
				return defer.promise;
			}
		}
	})
	//datepicker setting
	.service('dateRange', function($timeout) {
		return {
			dateSet: {
				startDate: null,
				endDate: null
			},
			dateOption: {
				dateLimit: {
					days: 365
				},
//				singleDatePicker: true,
				showDropdowns: true,
//				timePicker: true,
//				timePickerIncrement: 1,
//				timePicker24Hour: true,
				ranges: {
					'昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
					'这个月': [moment().startOf('month'), moment().endOf('month')],
					'上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				},
				opens: 'left',
//				format: 'YYYY-MM-DD HH:mm:ss',
				format: 'YYYY-MM-DD',
				separator: '至 ',
				locale: {
					applyLabel: '确定',
					cancelLabel: '取消',
					fromLabel: '从',
					toLabel: '至',
					customRangeLabel: '自定义时间段',
					daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
					monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
					firstDay: 1
				}
//				eventHandlers: {
//					'apply.daterangepicker': function(e, picker) {
//
//					}
//				}
		    }
		}
	})
	.service('spinner', function($timeout) {
		var spinner = '<div class="sk-spinner-custom"><div class="sk-spinner sk-spinner-double-bounce"><div class="sk-double-bounce1"></div><div class="sk-double-bounce2"></div></div></div>';
		return {
			show: function(selector) {
				if (!selector) {
					$timeout(function() {
						$('#uiview').append(spinner);
					}, 5);

				} else {
					$timeout(function() {
						$(selector).append(spinner);
					}, 5);
				}
			},
			hide: function() {
				$timeout(function() {
					$('.sk-spinner-custom').remove();
				}, 1000);
			}
		}
	})
	.service('msg', function(notify) {
		return {
			show: function(text, className) {
				if (typeof className == 'undefined') {
					className = '';
				} else if (className == 'success') {
					className = 'alert-success';
				} else if (className == 'warning') {
					className = 'alert-warning';
				} else if (className == 'info') {
					className = 'alert-info';
				} else if (className == 'error') {
					className = 'alert-danger';
				}
				notify({
				    message: text,
				    classes: className,
				    templateUrl: 'views/common/notify.html'
				});
			}
		}
	})
	.service('pop', function(swal) {
		return {
			usual: function(options) {
				if (angular.isObject(options)) {
					var config = {
						title: options.title || '温馨提示',
			        	text: options.msg || '',
			        	type: options.type || 'warning',
			        	confirmButtonColor: '#1ab394',
			        	confirmButtonText: options.okText || '我知道了',
			        	allowOutsideClick: options.outClick || false
					}
					swal(config).then(function(res) {
						//res.dismiss=="overlay"/"close"为关闭弹窗
						if (res.value) options.handler && options.handler(res);
					});
				} else console.warn('args => options not an object');
			},
			confirm: function(options) {
				if (angular.isObject(options)) {
					var config = {
						title: options.title || '温馨提示',
		            	text: options.msg || '发生错误了， 请检查',
		            	type: options.type || 'warning',
		            	showCancelButton: true,
		            	confirmButtonColor: options.okColor || '#1ab394',
		            	cancelButtonColor: options.failColor || '#e0e0e0',
		            	cancelButtonText: options.failText || '取消',
		            	confirmButtonText: options.okText || '我知道了',
		            	allowOutsideClick: options.outClick || false,
	            	 	reverseButtons: true
					}
					swal(config).then(function(res) {
						res.value ? options.confirm && options.confirm(res) : res.dismiss == 'cancel' ? options.cancel && options.cancel(res) : null;
					});
				} else console.warn('args => options not an object');
			},
			image: function(options) {
				if (angular.isObject(options)) {
					var config = {
						text: options.msg || '温馨提示',
		            	width: options.width || '300px',
		            	imageUrl: options.url || '',
		            	imageWidth: options.imgw || 250,
		            	imageHeight: options.imgh || 250,
						confirmButtonColor: options.okColor || '#1ab394',
						confirmButtonText: options.okText || '取消',
						allowOutsideClick: options.outClick || false,
						reverseButtons: true
					}
					swal(config).then(function(res) {
						if (res.value) options.handler && options.handler(res);
					});
				} else console.warn('args => options not an object');
			},
			input: function(options) {
				if (angular.isObject(options)) {
					var config = {
						title: options.title || '请输入内容',
		            	text: options.msg || '',
		            	type: options.type || 'question',
		            	input: options.inputType || 'text',
		            	inputValue: options.inputVal || '',
		            	inputPlaceholder: options.inputTips || '',
		            	inputAttributes: {
		            		autocapitalize: 'off'
		            	},
	            		showCancelButton: true,
		            	confirmButtonColor: options.okColor || '#1ab394',
		            	cancelButtonColor: options.failColor || '#e0e0e0',
		            	cancelButtonText: options.failText || '取消',
		            	confirmButtonText: options.okText || '确定',
		            	allowOutsideClick: options.outClick || false,
		            	reverseButtons: true
					}
					swal(config).then(function(res) {
						if (res.value) options.handler && options.handler(res);
					});
				} else console.warn('args => options not an object');
			},
			toast: function(arg1, arg2, arg3, arg4) {
				var types = ['success', 'error', 'warning', 'info', 'question'],
					placements = ['top', 'top-start', 'top-end', 'top-left', 'top-right', 'center', 'center-start', 'center-end', 'center-left', 'center-right', 'bottom', 'bottom-start', 'bottom-end', 'bottom-left', 'bottom-right'],
					msg, type, placement, timer;
				if (angular.isString(arg1)) {
					msg = arg1;
					angular.isString(arg2) && types.indexOf && typeof(types.indexOf) === 'function' && types.indexOf(arg2) >= 0 ? type = arg2 : type = '';
					angular.isString(arg2) && placements.indexOf && typeof(placements.indexOf) === 'function' && placements.indexOf(arg2) >= 0 ? placement = arg2 : placement = 'top';
					angular.isNumber(arg2) ? timer = arg2 : timer = 3000;

					if (angular.isString(arg3) && types.indexOf && typeof(types.indexOf) === 'function' && types.indexOf(arg2) >= 0) type = arg2;
					if (angular.isString(arg3) && placements.indexOf && typeof(placements.indexOf) === 'function' && placements.indexOf(arg3) >= 0) placement = arg3;
					if (angular.isNumber(arg3)) timer = arg3;

					if (angular.isString(arg4) && types.indexOf && typeof(types.indexOf) === 'function' && types.indexOf(arg4) >= 0) type = arg2;
					if (angular.isString(arg4) && placements.indexOf && typeof(placements.indexOf) === 'function' && placements.indexOf(arg4) >= 0) placement = arg3;
					if (angular.isNumber(arg4)) timer = arg4;
					swal({
						title: msg,
						type: type,
						toast: true,
						position: placement,
						showConfirmButton: false,
						timer: timer
					});

				} else console.warn('toast missed args => msg');
			}
		}
	});
})();