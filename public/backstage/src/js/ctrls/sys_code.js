angular.module('zm').controller('sysCodeCtrl', function($scope, $modal,$filter, $http, $rootVPath, request, spinner, dateRange, pop) {
	'use strict';             //                           		$scope, $modal, $rootVPath, regEx, request, spinner, pop , dateRange, msg

	alert('success');
	$scope.dateOption = dateRange.dateOption;
	$scope.dateRange = dateRange.daterange;

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

		init: function() {
			alert('success');
			$scope.dateRange = {startDate: moment(),endDate: moment()};
			// this.render();
		}

	}
	$scope.list.init();

	alert('success1');
	$scope.dateRange = {startDate: moment(),endDate: moment()};

});