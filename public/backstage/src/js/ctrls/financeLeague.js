angular.module('zm').controller('leagueCtrl', function($scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange, msg ) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;
	$scope.tab = 1;

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
				url: $rootVPath +'oleague/list',
				data: {
					p: p || 1,
					size: $scope.len,
					type: $scope.tab,
					name: $scope.name || '',
					stime: $scope.stime,
					etime: $scope.etime,
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

		// 充值
		recharge: function() {
			var _this = this;
			$modal.open({
				templateUrl: 'views/template/finance_league_add.html',
				controller: function($scope, $modalInstance) {
					request({
						url: $rootVPath +'oem/list',
						data: {},
						ok: function(res) {
							$scope.oemData = res.data.list;
						}
					});
				    //保存
					$scope.ok = function() {
						if( $scope.league == undefined || $scope.league == null){
							msg.show('请选择服务商', 'danger');
							return false;
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'oleague/add',
							data: {
								val: $scope.city_id,
								league: $scope.league,
								remark: $scope.remark || ''
							},
							ok: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '充值成功',
									msg: res.msg ? res.msg : '充值成功',
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
									title: '充值失败',
									msg: res.msg ? res.msg : '充值失败',
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
			this.render();
		},

		init: function() {
			this.switch(1);
		}
	}
	$scope.list.init();
});