angular.module('zm').controller('produceCtrl', function($scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange, msg ) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;

	$scope.dateOption = dateRange.dateOption;
	$scope.dateRange = dateRange.daterange;
	$scope.stime = '';
	$scope.etime = '';

	$scope.list = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'financial/chorder/list',
				data: {
					p: p || 1,
					size: $scope.len,
					stime: $scope.stime,
					etime: $scope.etime,
					name: $scope.name || ''
				},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		search: function(){
			var startDate = $scope.dateRange.startDate;
			var endDate = $scope.dateRange.endDate;
			if ( startDate == null && endDate == null ) {
				$scope.stime = '';
				$scope.etime = '' ;

			} else {
				var start_time = startDate.format('YYYY/MM/DD');
				var end_time = endDate.format('YYYY/MM/DD');
				$scope.stime = Date.parse(new Date(start_time)) / 1000;
				$scope.etime = Date.parse(new Date(end_time)) / 1000 ;
			}
			$scope.page = 1;
			this.render();
		},

		add: function(){
			var _this = this;
			$modal.open({
				templateUrl: 'views/template/finance_produce_add.html',
				controller: function($scope, $modalInstance) {
					//获取服务商列表
					request({
						url: $rootVPath +'oem/list',
						ok: function(res) {
							$scope.oemData = res.data.list;
						}
					});
					$scope.regMoney = regEx.MONEY;

					$scope.ok = function() {
						if( $scope.oem_id == undefined || !$scope.oem_id || $scope.oem_id == null ){
							msg.show('请选择服务商', 'danger');
							return false;
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'financial/chorder/add',
							data: {
								oem_id: $scope.oem_id,
								number: $scope.number,
								price: $scope.price
							},
							ok: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '新增成功',
									msg: res.msg ? res.msg : '新增成功',
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
									title: '新增失败',
									msg: res.msg ? res.msg : '新增失败',
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

		cancelOrder: function(sn){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '请先打电话与工厂端相关人员确认后再取消订单,您确定要取消该订单吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath + 'financial/chorder/del',
						data: { order_sn: sn },
						ok: function(res) {
	            			pop.usual({
	            				title: '取消成功',
	            				msg: res.msg ? res.msg : '取消成功',
	            				type: 'success',
	            				handler: function(res) {
	            					_this.render($scope.page);
	            				}
	            			});
						},
						fail: function(res) {
							pop.usual({
	            				title: '取消失败',
	            				msg: res.msg ? res.msg : '取消失败，请重试',
	            			});
						}
					});
				}
			});
		},

		// 查看物流
		logisticsMsg: function(sn){
			var _this = this;
			request({
				url: $rootVPath + 'financial/chorder/item',
				data: {
					order_sn: sn
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

		init: function() {
			$scope.dateRange = {startDate: moment(),endDate: moment()};
			this.render();
		}

	}
	$scope.list.init();
});