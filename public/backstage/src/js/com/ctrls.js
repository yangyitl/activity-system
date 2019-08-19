/**
 * ZM
 * MainCtrl - controller
 * Contains several global data used in different view
 */
function MainCtrl($scope, $http, $state, $rootVPath, menuPromise, pop) {
	menuPromise.menuData().then(function(response) {
		$scope.menus = response.data;
	});
	//logout
	$scope.logout = function() {
		pop.confirm({
			title: '退出登录',
			msg: '真的狠心离开吗？',
			type: 'question',
			okColor: '#1ab394',
			failColor: '#e0e0e0',
			failText: '真心留下',
			okText: '狠心离开',
			confirm: function(res) {
				$http.get($rootVPath +'logout').then(function success(res) {
					$state.go('login');
				}, function error(res) {
					pop.usual({
						title: '退出失败',
						msg: '您的网络不稳定，请重试',
						type: 'error'
					});
				});
			}
		});
	}
}

/* Pass all functions into module */
angular.module('zm').controller('MainCtrl', MainCtrl);