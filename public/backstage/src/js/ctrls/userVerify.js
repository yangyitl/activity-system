angular.module('zm').controller('verifyCtrl', function($scope, $filter, $modal, $rootVPath, request,  spinner, pop) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;

	$scope.FnVerify = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'auser/list',
				data: {
					p: p || 1,
					size: $scope.len,
					name: $scope.name || ''
				},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		isStatus: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'auser/edit',
				data: {
					val: id,
					user_status: checkCode
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

		init: function() {
			this.render();
		}
	}
	$scope.FnUser.init();
});