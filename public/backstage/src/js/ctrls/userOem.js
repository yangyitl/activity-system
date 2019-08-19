angular.module('zm').controller('userOemCtrl', function($scope, $filter, $http, $modal, $rootVPath, regEx, request, spinner, pop, md5, msg ) {
	'use strict';
	$scope.sum = 0;  //数据总条数
	$scope.len = 15; //每页显示条数
	$scope.max = 5;  //显示页数按钮个数
	$scope.page = 1;

	$scope.FnOem = {
		//render lsit
		render: function(p) {
			typeof p == 'undefined' ? $scope.page = 1 : null;
			spinner.show();
			request({
				url: $rootVPath +'oem/list',
				data: {
					p: p || 1,
					size: $scope.len,
					name: $scope.name || '',
					account: $scope.account || ''
				},
				ok: function(res) {
					$scope.listData = res.data.list;
					$scope.sum = res.data.listTotal;
				}
			});
		},

		add: function(){
			var _this = this;
			$modal.open({
				templateUrl: 'views/template/user_oem_add.html',
				controller: function($scope, $modalInstance) {
					//获取地址
					$http.get('src/json/cityTri.json').then(function success(res) {
						$scope.cityData = res.data;
					}, function error(res) {
						pop.usual({
							title: "请求失败",
							msg: '加载城市列表失败，请重试',
							type: "error",
						});
					});
					request({
						url: $rootVPath + 'operate/list',
						ok: function(res) {
							$scope.operatorData = res.data.list;
						}
					});
					$scope.status = 1;
					$scope.regPhone = regEx.PHONE;
					$scope.regPass = regEx.PASS;
					$scope.regMoney = regEx.MONEY;
					$scope.regAlltel = regEx.ALL_TEL;
					$scope.regNum = regEx.NUM;
				    //保存
					$scope.ok = function() {
						if( !$scope.operate_id || $scope.operate_id == null ){
							msg.show('请选择招商合伙人', 'danger');
							return false;
						}
						if( !$scope.province || $scope.province == null ){
							msg.show('请选择省/市', 'danger');
							return false;
						}
						if( !$scope.city || $scope.city == null ){
							msg.show('请选择市/区', 'danger');
							return false;
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'oem/add',
							data: {
								name: $scope.name,
								account: $scope.account,
								pass: md5.createHash($scope.pass),
								rpass: md5.createHash($scope.rpass),
								league: $scope.league,
								client_price: $scope.client_price,
								phone: $scope.phone,
								status: $scope.status,
								province: $scope.province.label,
								city: $scope.city.label,
								operate_id: $scope.operate_id
							},
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
				    //cancel join and close modal
				    $scope.cancel = function() {
				        $modalInstance.close();
				    };
				},
				backdrop: 'static'
			});
		},

		edit: function(index){
			var _this = this,
				itemInfo = $scope.listData[index];
			$modal.open({
				templateUrl: 'views/template/user_oem_edit.html',
				controller: function($scope, $modalInstance) {
					//获取地址
					$http.get('src/json/cityTri.json').then(function success(res) {
						$scope.cityData = res.data;
						angular.forEach($scope.cityData , function( item ) {
							if( item.label == itemInfo.province ){
								$scope.province = item ;
								angular.forEach(item.children , function( each ) {
									if( each.label == itemInfo.city){
										$scope.city = each ;
									}
								});
							}
						});
					}, function error(res) {
						pop.usual({
							title: "请求失败",
							msg: '加载城市列表失败，请重试',
							type: "error",
						});
					});
					request({
						url: $rootVPath + 'operate/list',
						ok: function(res) {
							$scope.operatorData = res.data.list;
							$scope.operate_id = itemInfo.operate_id ;
						}
					});
					$scope.regPhone = regEx.PHONE;
					$scope.regPass = regEx.PASS;
					$scope.regMoney = regEx.MONEY;
					$scope.regAlltel = regEx.ALL_TEL;
					$scope.regNum = regEx.NUM;

					$scope.name = itemInfo.name;
					$scope.account = itemInfo.account;
					$scope.phone = itemInfo.phone;
					$scope.league = itemInfo.league;
					$scope.client_price = itemInfo.client_price;

				    //保存
					$scope.ok = function() {
						if( !$scope.operate_id || $scope.operate_id == null ){
							msg.show('请选择招商合伙人', 'danger');
							return false;
						}
						if( !$scope.province || $scope.province == null ){
							msg.show('请选择省/市', 'danger');
							return false;
						}
						if( !$scope.city || $scope.city == null ){
							msg.show('请选择市/区', 'danger');
							return false;
						}
						if(Number($scope.commission) > 100 ){
							msg.show('分成不能大于100', 'danger');
							return false;
						}
						var param = {
							val: itemInfo.id,
							name: $scope.name,
							account: $scope.account,
							league: $scope.league,
							client_price: $scope.client_price,
							phone: $scope.phone,
							province: $scope.province.label,
							city: $scope.city.label,
							operate_id: $scope.operate_id
						};
						if( ( $scope.pass != undefined && $scope.pass.length ) || ($scope.rpass != undefined && $scope.rpass.length) ) {
							if( $scope.pass != $scope.rpass ) {
								msg.show('密码与确认密码必须一致', 'danger');
								return false ;
							} else {
								param.pass = md5.createHash($scope.pass);
								param.rpass = md5.createHash($scope.rpass);
							}
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'oem/edit',
							data: param,
							ok: function(res) {
								$scope.wait = false;
								pop.usual({
									title: '编辑成功',
									msg: res.msg ? res.msg : '编辑成功',
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
									title: '编辑失败',
									msg: res.msg ? res.msg : '编辑失败',
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

		isWithdraws: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'oem/edit',
				data: {
					val: id,
					withdraws_status: checkCode
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

		isHighRisk: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'oem/edit',
				data: {
					val: id,
					highrisk: checkCode
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
				url: $rootVPath + 'oem/edit',
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
				msg: '您确定要删除该账号吗？',
				okText: '确定',
				type: 'question',
				confirm: function(res) {
	          		request({
						url: $rootVPath +'oem/del',
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
	$scope.FnOem.init();
});