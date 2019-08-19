angular.module('zm').controller('divideCtrl', function($scope, $filter, $modal, $rootVPath, request, regEx, spinner, pop) {
	'use strict';

	$scope.FnPrice = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'commission/list',
				data: {},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		add: function(){
			var _this = this;
			if ($scope.listData.length == 0) {
				addModal();
			} else {
				var isErr = false;
				angular.forEach($scope.listData, function(item, i) {
					if (!isErr) {
						if (!item.max) {
							pop.usual({
								title: '警告',
								msg: '你已经设置了一档无限大的区间，无法在继续添加'
							});
							isErr = true;
						}
					}
				});
				if (!isErr) addModal();
			}
			function addModal(){
				var modal = $modal.open({
					templateUrl: 'views/template/coupon_divide_add.html',
					controller: function($scope, $modalInstance) {
						$scope.regNum = regEx.NUM;
					    //保存
					    $scope.ok = function () {
							if( $scope.max != 0 && Number( $scope.max ) <=  Number( $scope.min ) ){
								msg.show('最大值必须要大于最小值','danger');
								return false;
							};
							if( Number( $scope.total_fee ) >  Number( $scope.min ) ){
								msg.show('服务商分成不能大于最小值','danger');
								return false;
							};
					        var param = {
					        	min: $scope.min,
					        	max: $scope.max,
					        	total_fee: $scope.total_fee
					        };
					        $scope.wait = true;
					        request({
								type: 'POST',
								url: $rootVPath +'commission/add',
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
			}

		},

		edit: function(type, e, id) {
			var _this = this;
			var data = {val: id}, val = e.target.value;
			if (type == 1) {
				data.min = val;
			} else if (type == 2) {
				data.max = val;
			} else if (type == 3) {
				data.total_fee = val;
			}
			request({
				type: 'POST',
				url: $rootVPath +'commission/edit',
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
				msg: '您确定要删除该分成区间吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'commission/del',
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