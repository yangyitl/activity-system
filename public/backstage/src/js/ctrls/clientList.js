angular.module('zm').controller('clientListCtrl', function($scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;
	$scope.tab = 1;
	$scope.sort = 'id';


	$scope.list = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'client/list',
				data: {
					p: p || 1,
					size: $scope.len,
					is_live: $scope.tab,
					hardware: $scope.hardware || '',
					ip: $scope.ip || '',
					merName: $scope.merName || '',
					sn: $scope.sn || '',
					qrCode: $scope.qrCode || '',
					sort: $scope.sort || '',
				},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		//排序
		sortList: function(type){
			$scope.sort = type;
			this.render();
		},

		//设备订单
		order: function(index){
			$scope.showMask = true;
			$scope.showOrder = true;
			$scope.pageS = 1;
			$scope.lenS = 15;
			$scope.sunsS = 0;

			var info = $scope.listData[index];
			$scope.client_name = info.client_name;
			$scope.client_id = info.id;
			$scope.dateOption = dateRange.dateOption;
			$scope.dateRange = dateRange.daterange;

			$scope.init = {
				tab: 0,
				stime: '',
				etime: ''
			}
			$scope.FnOrder = {
				orderTab: function(i) {
					$scope.init.tab = i;
					$scope.init.stime = '';
					$scope.init.etime = '';
					$scope.dateRange = {startDate: moment(),endDate: moment()};
					this.get();
				},
				get: function(p){
					typeof p == 'undefined' ? $scope.pageS = 1 : null;
					var type = $scope.init.tab == 0 ? 'alipay' : $scope.init.tab == 1 ? 'wx' : 'ad' ;
					spinner.show('.slide-content');
					request({
						url: $rootVPath +'client/order/' + type,
						data: {
							val: $scope.client_id,
							p: p || 1,
							size: $scope.lenS,
							stime: $scope.init.stime,
							etime: $scope.init.etime
						},
						ok: function(res) {
							$scope.listDataS = res.data.list;
							$scope.sunsS = res.data.listTotal;
						}
					});
				},
				'search': function(){
					var startDate = $scope.dateRange.startDate;
					var endDate = $scope.dateRange.endDate;
					if ( startDate == null && endDate == null ) {
						var now_time = Math.round(new Date().getTime()/1000);
						$scope.init.stime = now_time;
						$scope.init.etime = now_time ;

					} else {
						var start_time = startDate.format('YYYY/MM/DD');
						var end_time = endDate.format('YYYY/MM/DD');
						$scope.init.stime = Date.parse(new Date(start_time)) / 1000;
						$scope.init.etime = Date.parse(new Date(end_time)) / 1000 ;
					}
					$scope.pageS = 1;
					this.get();
				},
				init: function(){
					this.orderTab(0);
				}
			}
			$scope.FnOrder.init();
		},
		closeSlider: function () {
			$scope.showMask = false;
			$scope.showOrder = false;
		},

		//生成码
		codeQr: function(id , type){
			var typeText  = type == 1 ? 'start' : 'sn';
			pop.usual({
				title: '温馨提示',
				msg: '即将打开图片下载窗口，为了能即时下载图片，请允许浏览器新窗口打开链接的功能！',
				handler: function(res) {
					request({
						url: $rootVPath +'client/code/' + typeText,
						data: {
							val: id
						},
						ok: function(res) {
							// window.open(res.data.img);
							var src = res.data.img;
							var ele = document.createElement('a');
						    ele.setAttribute("href", src);
							ele.setAttribute("download", "");
						    var event = new MouseEvent('click');
						    ele.dispatchEvent(event);
						},
						fail: function(res) {
							$scope.wait = false;
							pop.usual({
								title: '二维码生成失败',
								msg: res.msg ? res.msg : ''
							});
						}
					});
				}
			});
		},

		//设备重置
		reset: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要重置该设备吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'client/init',
						data: { val: id },
						ok: function(res) {
	            			pop.usual({
	            				title: '重置成功',
	            				msg: res.msg ? res.msg : '重置成功',
	            				type: 'success',
	            				handler: function(res) {
	            					_this.render($scope.page);
	            				}
	            			});
						},
						fail: function(res) {
							pop.usual({
	            				title: '重置失败',
	            				msg: res.msg ? res.msg : '重置失败',
	            			});
						}
					});
				}
			});
		},

		//设备解绑
		unBing: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要解绑该设备吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'client/un',
						data: { val: id },
						ok: function(res) {
	            			pop.usual({
	            				title: '解绑成功',
	            				msg: res.msg ? res.msg : '解绑成功',
	            				type: 'success',
	            				handler: function(res) {
	            					_this.render($scope.page);
	            				}
	            			});
						},
						fail: function(res) {
							pop.usual({
	            				title: '解绑失败',
	            				msg: res.msg ? res.msg : '解绑失败',
	            			});
						}
					});
				}
			});
		},


		//设备远程升级
		remoteUp: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要远程升级该设备吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'client/up',
						data: { val: id },
						ok: function(res) {
	            			pop.usual({
	            				title: '升级成功',
	            				msg: res.msg ? res.msg : '升级成功',
	            				type: 'success',
	            				handler: function(res) {
	            					_this.render($scope.page);
	            				}
	            			});
						},
						fail: function(res) {
							pop.usual({
	            				title: '升级失败',
	            				msg: res.msg ? res.msg : '升级失败',
	            			});
						}
					});
				}
			});
		},

		//设备添加物流
		addLogistics: function(id){
			var _this = this;
			pop.input({
				title: '添加物流快递号',
				inputTips: '请输入物流快递号',
				inputVal: '',
				handler: function(res) {
					if(res.value){
						request({
							url: $rootVPath +'client/mark' ,
							data: {
								val: id,
								mark: res.value
							},
							ok: function(res) {
								pop.usual({
		            				title: '添加成功',
		            				msg: res.msg ? res.msg : '添加成功',
		            				type: 'success',
		            				handler: function(res) {
		            					_this.render($scope.page);
		            				}
		            			});
							},
							fail: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '添加失败',
									msg: res.msg ? res.msg : ''
								});
							}
						});
					} else {
						pop.usual({
            				title: '温馨提示',
            				msg: '物流快递号不能为空',
            			});
					}
				}
			});
		},

		//设备查看物流
		logisticsMsg: function(id){
			var _this = this;
			request({
				url: $rootVPath + 'client/flow',
				data: {
					val: id
				},
				ok: function(res) {
					var logisticsData = res.data;
					$modal.open({
						templateUrl: 'views/template/client_logistics.html',
						controller: function($scope, $modalInstance) {
							$scope.logisticsData = logisticsData;

						    $scope.cancel = function() {
						        $modalInstance.close();
						    };
						},
						backdrop: 'static'
					});
				}
			});
		},

		// 设备编辑
		edit: function(index) {
			var _this = this,
				itemInfo = $scope.listData[index];
			$modal.open({
				templateUrl: 'views/template/client_edit.html',
				controller: function($scope, $modalInstance) {
					$scope.client_name = itemInfo.client_name;
					$scope.client_sn = itemInfo.client_sn;
					$scope.qr_code = itemInfo.qr_code;
					$scope.SIM = itemInfo.SIM;
					$scope.start_number = itemInfo.start_number;

				    //保存
					$scope.ok = function() {
						$scope.wait = true;
						request({
							url: $rootVPath + 'client/edit',
							data: {
								val: itemInfo.id,
								name: $scope.name,
								client_sn: $scope.client_sn,
								qr_code: $scope.qr_code,
								SIM: $scope.SIM || '',
								start_number: $scope.start_number || ''
							},
							ok: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '编辑成功',
									msg: res.msg ? res.msg : '编辑成功',
									type: 'success',
									handler: function(res) {
										$modalInstance.close();
										_this.render();

									}
								});
							},
							fail: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '编辑失败',
									msg: res.msg ? res.msg : '编辑失败',
								});
							}
						});
				    };
				    //cancel join and close modal
				    $scope.cancel = function() {
				        $modalInstance.close();
				    };
				},
				backdrop: 'static'
			});
		},

		//switch tab
		switch: function(i) {
			$scope.tab = i;
			$scope.sort = 'id';
			this.render();
		},

		init: function() {
			this.render();
		}
	}
	$scope.list.init();
});