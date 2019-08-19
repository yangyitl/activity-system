angular.module('zm').controller('userAlipayCtrl', function($scope, $filter, $modal, $rootVPath, request, spinner, pop, regEx , msg) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;

	$scope.FnCar = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'amerchant/list',
				data: {
					p: p || 1,
					size: $scope.len,
					name: $scope.name || ''
				},
				ok: function(res) {
					$scope.listData = [];
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		isAlipay: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'amerchant/edit',
				data: {
					val: id,
					is_alipay: checkCode
				},
				ok: function(res) {
					pop.usual({
						title: '修改成功',
						msg: res.msg ? res.msg : '修改成功',
						type: 'success',
						handler: function(res) {
							_this.render();
						}
					});
				},
				fail: function(res) {
					isChecked ? e.target.checked = false : e.target.checked = true;
					pop.usual({
						title: '修改失败',
						msg: res.msg ? res.msg : '修改失败',
					});
				}
			});
		},


		isStatus: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'amerchant/edit',
				data: {
					val: id,
					status: checkCode
				},
				ok: function(res) {
					pop.usual({
						title: '修改成功',
						msg: res.msg ? res.msg : '修改成功',
						type: 'success',
						handler: function(res) {
							_this.render();
						}
					});
				},
				fail: function(res) {
					isChecked ? e.target.checked = false : e.target.checked = true;
					pop.usual({
						title: '修改失败',
						msg: res.msg ? res.msg : '修改失败',
					});
				}
			});
		},

		del: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要删除该支付宝车主的账号吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'amerchant/del',
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
			})
		},

		init: function() {
			this.render();
		}

	}
	$scope.FnCar.init();
});