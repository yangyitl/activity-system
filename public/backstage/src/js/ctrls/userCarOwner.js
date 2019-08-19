angular.module('zm').controller('userCarCtrl', function($scope, $filter, $modal, $rootVPath, request, spinner, pop, regEx , msg) {
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
				url: $rootVPath +'merchant/list',
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

		isWithdraws: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'merchant/edit',
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

		isPay: function(e, id) {
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'merchant/edit',
				data: {
					val: id,
					is_pay: checkCode
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
				url: $rootVPath + 'merchant/edit',
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

		isAlipay: function(){
			var _this = this;
			var isChecked = e.target.checked,
				checkCode = isChecked ? 1 : 0;
			request({
				url: $rootVPath + 'merchant/edit',
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
				url: $rootVPath + 'merchant/edit',
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

		edit: function(index){
			var _this = this,
				itemInfo = $scope.listData[index];
			$modal.open({
				templateUrl: 'views/template/user_car_edit.html',
				controller: function($scope, $modalInstance) {
					$scope.regID = regEx.ID;

					$scope.name = itemInfo.name;
					$scope.account = itemInfo.account;
					$scope.real_name = itemInfo.real_name;
					$scope.id_no = itemInfo.id_no;
					$scope.car_no = itemInfo.car_no;

					var arryD = [],
						arryT = [];
					arryD.push(itemInfo.driving_img);
					arryT.push(itemInfo.travel_img);

					$scope.driving_img = arryD;
					$scope.travel_img = arryT;
					$scope.id_card_img = itemInfo.id_card_img;


					$scope.optionsID = {
						url: $rootVPath +'upload',
						size: 5,
						length: 2,
						disabled: function() {
							pop.usual({
								title: '温馨提示',
								msg: '请上传身份证正反面照片'
							});
						}
					};
					$scope.optionsDriving= {
						url: $rootVPath +'upload',
						size: 5,
						disabled: function() {
							pop.usual({
								title: '温馨提示',
								msg: '请上传驾驶证照片'
							});
						}
					};
					$scope.optionsTravel = {
						url: $rootVPath +'upload',
						size: 5,
						disabled: function() {
							pop.usual({
								title: '温馨提示',
								msg: '请上传行驶证照片'
							});
						}
					};

				    //保存
					$scope.ok = function() {
						if(!$scope.id_card_img.length){
							msg.show('请上传身份证正反面照片','danger');
							return false;
						}
						if(!$scope.driving_img.length){
							msg.show('请上传驾驶证照片','danger');
							return false;
						}
						if(!$scope.travel_img.length){
							msg.show( '请上传行驶证照片','danger');
							return false;
						}
						var param = {
							val: itemInfo.id,
							real_name: $scope.real_name,
							id_no: $scope.id_no,
							car_no: $scope.car_no,
							id_card_img: $scope.id_card_img,
							driving_img: $scope.driving_img,
							travel_img: $scope.travel_img
						};
						$scope.wait = true;
						request({
							url: $rootVPath + 'merchant/edit',
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

		verify: function(index){
			var _this = this,
				itemInfo = $scope.listData[index];
			$modal.open({
				templateUrl: 'views/template/user_car_verify.html',
				controller: function($scope, $modalInstance) {
					$scope.regID = regEx.ID;

					$scope.name = itemInfo.name;
					$scope.account = itemInfo.account;
					$scope.real_name = itemInfo.real_name;
					$scope.id_no = itemInfo.id_no;
					$scope.car_no = itemInfo.car_no,
					$scope.id_card_img = itemInfo.id_card_img;
					$scope.driving_img = itemInfo.driving_img;
					$scope.travel_img = itemInfo.travel_img;

					$scope.is_auth = 1;

				    //保存
					$scope.ok = function() {
						var param = {
							val: itemInfo.id,
							is_auth: $scope.is_auth
						};
						if($scope.is_auth == 1) {
							if($scope.real_name  == undefined || !$scope.real_name.trim().length){
								msg.show('真实姓名不能为空','danger');
								return false;
							}
							if($scope.id_no  == undefined || !$scope.id_no.trim().length){
								msg.show('身份证号不能为空','danger');
								return false;
							}
							if($scope.car_no  == undefined || !$scope.car_no.trim().length){
								msg.show('车牌号不能为空','danger');
								return false;
							}
							param.real_name = $scope.real_name;
							param.id_no = $scope.id_no;
							param.car_no = $scope.car_no;
						} else {
							if($scope.remark  == undefined || !$scope.remark.trim().length){
								msg.show('请填写不通过的原因','danger');
								return false;
							}
							param.remark = $scope.remark;
						}
						$scope.wait = true;
						request({
							url: $rootVPath + 'merchant/edit',
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
									title: '审核失败',
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
		},

		init: function() {
			this.render();
		}

	}
	$scope.FnCar.init();
});