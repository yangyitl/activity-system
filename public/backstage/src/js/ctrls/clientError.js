angular.module('zm').controller('clientErrorCtrl', function($scope, $modal, $rootVPath, regEx, request, dateRange, spinner, pop, msg ) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;
	$scope.tab = 0;

	$scope.stime = '';
	$scope.etime = '';
	$scope.dateOption = dateRange.dateOption;
	$scope.dateRange = dateRange.daterange;

	$scope.list = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'eclient/list',
				data: {
					p: p || 1,
					size: $scope.len,
					status: $scope.tab,
					type_id: $scope.type_id,
					stime: $scope.stime,
					etime: $scope.etime
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
				var now_time = Math.round(new Date().getTime()/1000);
				$scope.stime = now_time;
				$scope.etime = now_time;
			} else {
				var start_time = startDate.format('YYYY/MM/DD');
				var end_time = endDate.format('YYYY/MM/DD');
				$scope.stime = Date.parse(new Date(start_time)) / 1000;
				$scope.etime = Date.parse(new Date(end_time)) / 1000 ;
			}
			$scope.page = 1;
			this.render();
		},

		handle: function(index){
			var _this = this,
				itemInfo = $scope.listData[index];
			$modal.open({
				templateUrl: 'views/template/client_error_edit.html',
				controller: function($scope, $modalInstance) {
					$scope.type_name = itemInfo.type_name;
					$scope.remark = itemInfo.remark;
				    //保存
					$scope.ok = function() {
						if($scope.reply == undefined ||  !$scope.reply.trim().length){
							msg.show( '请填写回复的内容','danger');
							return false;
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'eclient/edit',
							data: {
								val: itemInfo.id,
								status: 1,
								reply: $scope.reply,
							},
							ok: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '处理成功',
									msg: res.msg ? res.msg : '处理成功',
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
									title: '处理失败',
									msg: res.msg ? res.msg : '处理失败',
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
			$scope.dateRange = {startDate: moment(),endDate: moment()};
			this.search();
		},

		init: function() {
			request({
				url: $rootVPath +'errort/list',
				data: {},
				ok: function(res) {
					var errorArry = res.data.list;
					errorArry.unshift({'id': '','name':'全部'});
					$scope.errorList = errorArry;
					$scope.type_id = $scope.errorList[0].id ;
				}
			});
			this.switch(0);
		}

	}
	$scope.list.init();
});