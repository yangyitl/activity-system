angular.module('zm').controller('couponCtrl', function($scope, $filter, $modal, $rootVPath, request, regEx, spinner, pop) {
	'use strict';

	$scope.FnPrice = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'unit/list',
				data: {},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		add: function(){
			var _this = this;
			var modal = $modal.open({
				templateUrl: 'views/template/coupon_price_add.html',
				controller: function($scope, $modalInstance) {
					$scope.regNum = regEx.NUM;
					$scope.typeList =[{'name':'正常流程','id': 0},{'name':'淘宝流程','id': 1}];
					$scope.type = $scope.typeList[0].id;

				    //保存
				    $scope.ok = function () {
						if(  Number( $scope.max ) <=  Number( $scope.min ) ){
							msg.show('最大值必须要大于最小值','danger');
							return false;
						};
						$scope.wait = true;
				        var param = {
				        	min: $scope.min,
				        	max: $scope.max,
				        	type: $scope.type
				        };
				        request({
							type: 'POST',
							url: $rootVPath +'unit/add',
							data: param,
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
				    $scope.close = function () {
				        $modalInstance.close();
				    };
				},
				backdrop: 'static'
			})
		},

		edit: function(type, e, id) {
			var _this = this;
			var data = {val: id}, val = e.target.value;
			if (type == 1) {
				data.min = val;
			} else if (type == 2) {
				data.max = val;
			}
			request({
				type: 'POST',
				url: $rootVPath +'unit/edit',
				data: data,
				ok: function(res) {
					pop.usual({
						title: '修改成功',
						msg: res.msg ? res.msg : '已修改',
						type: 'success',
						handler: function(res) {
							_this.render();
						}
					});
				},
				fail: function(res){
					pop.usual({
						title: '修改失败',
						msg: res.msg ? res.msg : '修改失败',
						handler: function(res) {
							_this.render();
						}
					});
				}
			});
		},

		del: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要删除该优惠区间吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'unit/del',
						data: { val: id },
						ok: function(res) {
	            			pop.usual({
	            				title: '删除成功',
	            				msg: res.msg ? res.msg : '删除成功',
	            				type: 'success',
	            				handler: function(res) {
	            					_this.render();
	            				}
	            			});
						},
						fail: function(res) {
							pop.usual({
	            				title: '删除失败',
	            				msg: res.msg ? res.msg : '删除失败',
	            			});
						}
					});
				}
			});
		},

		init: function() {
			this.render();
		}
	}
	$scope.FnPrice.init();
});