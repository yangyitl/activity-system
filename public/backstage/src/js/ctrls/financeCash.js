angular.module('zm').controller('cashCtrl', function($scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange, msg) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;
	$scope.tab = 2;
	$scope.stime = '';
	$scope.etime = '';

	$scope.dateOption = dateRange.dateOption;
	$scope.dateRange = dateRange.daterange;
	$scope.statusArry = [{'name': '待审核','id': 0},{'name': '已通过','id': 1},{'name': '不通过','id': 1}];

	$scope.list = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'withdraws/list',
				data: {
					p: p || 1,
					size: $scope.len,
					type: $scope.tab,
					status: $scope.status,
					name: $scope.name || '',
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

		// 审核
		verify: function(index) {
			var _this = this,
				itemInfo = $scope.listData[index];
			if(itemInfo.highrisk == 1){
				pop.confirm({
					title: '温馨提示',
					msg: '该账户可能存在高风险,是否继续审核？',
					okText: '确定',
					type: 'question',
					confirm: function(res) {
		          		showModal();
					}
				});
			} else {
				showModal();
			}
			function showModal() {
				$modal.open({
					templateUrl: 'views/template/finance_cash_verify.html',
					controller: function($scope, $modalInstance) {
						$scope.type = itemInfo.type;
						$scope.card = itemInfo.card;
						$scope.avatar = itemInfo.avatar;
						$scope.nickname = itemInfo.nickname;
						$scope.role_name = itemInfo.role_name;
						$scope.old_balance = itemInfo.old_balance;
						$scope.apply_money = itemInfo.apply_money;
						$scope.commission_charge = itemInfo.commission_charge;
						$scope.actual_money = itemInfo.actual_money;
						$scope.new_balance = itemInfo.new_balance;
						$scope.created_at = itemInfo.created_at;
						$scope.status = 1;

					    //保存
						$scope.ok = function() {
							if($scope.status == 2 && ( $scope.remark == undefined  || !$scope.remark.trim().length )){
								msg.show('请填写不通过的原因', 'danger');
								return false;
							}
							var param = {
								val: itemInfo.id,
								status: $scope.status
							};
							if($scope.status == 2){
								param.remark = $scope.remark;
							}
							request({
								url: $rootVPath + 'withdraws/edit',
								data: param,
								ok: function(res) {
									$scope.wait = false;
									pop.usual({
										title: '审核成功',
										msg: res.msg ? res.msg : '审核成功',
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
										title: '审核败',
										msg: res.msg ? res.msg : '审核失败',
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
			}
		},

		//switch tab
		switch: function(i) {
			$scope.tab = i;
			$scope.dateRange = {startDate: moment(),endDate: moment()};
			$scope.status = $scope.statusArry[0].id;
			this.render();
		}
	}
	$scope.list.switch(1);
});