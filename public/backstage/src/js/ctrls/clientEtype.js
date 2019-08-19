angular.module('zm').controller('etypeCtrl', function($scope, $filter, $http, $modal, $rootVPath, regEx, request, spinner, pop, msg ) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;

	$scope.FnEtype = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'errort/list',
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

		add: function(){
			var _this = this;
			pop.input({
				title: '新增故障类型',
				inputTips: '请填写故障类型',
				inputVal: '',
				handler: function(res){
					if(res.value && res.value.trim().length){
						request({
							url: $rootVPath +'errort/add',
							data: { name: res.value },
							ok: function(res) {
		            			pop.usual({
		            				title: '新增成功',
		            				msg: res.msg ? res.msg : '新增成功',
		            				type: 'success',
		            				handler: function(res) {
		            					_this.render();
		            				}
		            			});
							},
							fail: function(res) {
								pop.usual({
		            				title: '新增失败',
		            				msg: res.msg ? res.msg : '新增失败',
		            			});
							}
						});
					} else {
						pop.usual({
            				title: '新增失败',
            				msg: '故障类型不能空',
            			});
					}
				}
			});
		},

		edit: function(index){
			var _this = this,
				itemInfo = $scope.listData[index];
			pop.input({
				title: '修改故障类型',
				inputTips: '请填写故障类型',
				inputVal: itemInfo.name,
				handler: function(res){
					if(res.value && res.value.trim().length){
						request({
							url: $rootVPath +'errort/add',
							data: { name: res.value },
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
								pop.usual({
		            				title: '修改失败',
		            				msg: res.msg ? res.msg : '修改失败',
		            			});
							}
						});
					} else {
						pop.usual({
            				title: '修改失败',
            				msg: '故障类型不能空',
            			});
					}
				}
			});
		},

		del: function(id){
			var _this = this;
			pop.confirm({
				title: '温馨提示',
				msg: '您确定要删除该故障类型吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'errort/del',
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
	$scope.FnEtype.init();
});