function config($provide, $httpProvider, $stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $controllerProvider, $compileProvider, $filterProvider) {
    'use strict';
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

    //must to register controller, if you not to do that, the lazyload js files not working
    //also you can register others
    var app = angular.module('zm');
    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false,
        events: true
    });

    //拼接模板路径
    function viewportURL(template) {
        return 'views/common/' + template + '.html';
    }

    function templateURL(template) {
        return 'views/' + template + '.html';
    }

    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: templateURL('login'),
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            serie: true,
                            name: 'localytics.directives',
                            files: ['src/css/plugins/chosen/bootstrap-chosen.css', 'src/js/plugins/chosen/chosen.jquery.js', 'src/js/plugins/chosen/chosen.js']
                        },
                        {
                            serie: true,
                            name: 'angular-md5',
                            files: ['src/js/plugins/md5/angular-md5.min.js', 'src/js/ctrls/login.js?v=18110801a']
                        }
                    ]);
                }
            }
        })
        //首页
        .state('dashboards', {
            abstract: true,
            url: '/dashboards',
            templateUrl: viewportURL('content')
        })
        .state('dashboards.board', {
            url: '',
            templateUrl: templateURL('board'),
            data: {pageTitle: '平台概览'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            reconfig: true,
                            serie: true,
                            files: ['src/js/plugins/echarts/echarts.min.js', 'src/js/plugins/echarts/map/js/china.js', 'src/js/ctrls/board.js?v=18110801a']
                        }
                    ]);
                }
            }
        })

        //设备管理
        // .state('client', {
        // 	abstract: true,
        //     url: '/client',
        //     templateUrl: viewportURL('content')
        // })
        // .state('client.list', {
        //     url: '/list',
        //     templateUrl: templateURL('client_list'),
        //     data: { pageTitle: '设备列表' },
        //     resolve: {
        //     	loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                 	files: ['src/js/ctrls/clientList.js?v=18110801a']
        //                 }
        //             ]);
        //     	}
        //     }
        // })
        // .state('client.etype', {
        //     url: '/etype',
        //     templateUrl: templateURL('client_etype'),
        //     data: { pageTitle: '故障类型' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     files: ['src/js/ctrls/clientEtype.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('client.error', {
        //     url: '/error',
        //     templateUrl: templateURL('client_error'),
        //     data: { pageTitle: '设备报障' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/clientError.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })

        // 用户管理
        .state('user', {
            abstract: true,
            url: '/user',
            templateUrl: viewportURL('content')
        })
        // .state('user.operator', {
        //     url: '/operator',
        //     templateUrl: templateURL('user_operator'),
        //     data: { pageTitle: '招商合伙人' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     insertBefore: '#loadBefore',
        //                     serie: true,
        //                     name: 'localytics.directives',
        //                     files: ['src/css/plugins/chosen/bootstrap-chosen.css','src/js/plugins/chosen/chosen.jquery.js','src/js/plugins/chosen/chosen.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     files: ['src/css/plugins/iCheck/custom.css','src/js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-md5',
        //                     files: ['src/js/plugins/md5/angular-md5.min.js', 'src/js/ctrls/userOperator.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('user.oem', {
        //     url: '/oem',
        //     templateUrl: templateURL('user_oem'),
        //     data: { pageTitle: '服务商' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     files: ['src/css/plugins/iCheck/custom.css','src/js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-md5',
        //                     files: ['src/js/plugins/md5/angular-md5.min.js', 'src/js/ctrls/userOem.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('user.agent', {
        //     url: '/agent',
        //     templateUrl: templateURL('user_agent'),
        //     data: { pageTitle: '代理合伙人' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     files: ['src/js/ctrls/userAgent.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('user.car_owner', {
        //     url: '/car_owner',
        //     templateUrl: templateURL('user_car_owner'),
        //     data: { pageTitle: '车主' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     files: ['src/css/plugins/iCheck/custom.css','src/js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/userCarOwner.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('user.car_alipay', {
        //     url: '/car_alipay',
        //     templateUrl: templateURL('user_car_alipay'),
        //     data: { pageTitle: '支付宝车主' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     files: ['src/css/plugins/iCheck/custom.css','src/js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/userCarAlipay.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })

        // 用户
        .state('user.list', {
            url: '/list',
            templateUrl: templateURL('user_list'),
            data: {pageTitle: '用户列表'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['src/js/ctrls/userList.js?v=18110801a']
                        }
                    ]);
                }
            }
        })

        // .state('coupon', {
        //     abstract: true,
        //     url: '/coupon',
        //     templateUrl: viewportURL('content')
        // })
        // .state('coupon.price', {
        //     url: '/price',
        //     templateUrl: templateURL('coupon_price'),
        //     data: { pageTitle: '优惠区间' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/couponPrice.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('coupon.divide', {
        //     url: '/divide',
        //     templateUrl: templateURL('coupon_divide'),
        //     data: { pageTitle: '分成区间' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/couponDivide.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })

        //财务
        .state('finance', {
            abstract: true,
            url: '/finance',
            templateUrl: viewportURL('content')
        })
        // .state('finance.league', {
        //     url: '/league',
        //     templateUrl: templateURL('finance_league'),
        //     data: { pageTitle: '加盟费管理' },
        //     resolve: {
        //     	loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     insertBefore: '#loadBefore',
        //                     serie: true,
        //                     name: 'localytics.directives',
        //                     files: ['src/css/plugins/chosen/bootstrap-chosen.css','src/js/plugins/chosen/chosen.jquery.js','src/js/plugins/chosen/chosen.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                 	files: ['src/js/ctrls/financeLeague.js?v=18110801a']
        //                 }
        //             ]);
        //
        //
        //     	}
        // 	}
        // })
        // .state('finance.cash', {
        //     url: '/cash',
        //     templateUrl: templateURL('finance_cash'),
        //     data: { pageTitle: '提现管理' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     files: ['src/css/plugins/iCheck/custom.css','src/js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/financeCash.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        .state('finance.order', {
            url: '/order',
            templateUrl: templateURL('finance_order'),
            data: {pageTitle: '订单列表'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'daterangepicker',
                            files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
                        },
                        {
                            files: ['src/js/ctrls/financeOrder.js?v=18110801a']
                        }
                    ]);
                }
            }
        })
        // .state('finance.client_order', {
        //     url: '/client_order',
        //     templateUrl: templateURL('finance_client_order'),
        //     data: {pageTitle: '用户列表'},
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/financeClient.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })
        // .state('finance.produce_order', {
        //     url: '/produce_order',
        //     templateUrl: templateURL('finance_produce_order'),
        //     data: { pageTitle: '设备生产订单' },
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     serie: true,
        //                     name: 'daterangepicker',
        //                     files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
        //                 },
        //                 {
        //                     insertBefore: '#loadBefore',
        //                     serie: true,
        //                     name: 'localytics.directives',
        //                     files: ['src/css/plugins/chosen/bootstrap-chosen.css','src/js/plugins/chosen/chosen.jquery.js','src/js/plugins/chosen/chosen.js']
        //                 },
        //                 {
        //                     serie: true,
        //                     name: 'angular-ladda',
        //                     files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
        //                 },
        //                 {
        //                     files: ['src/js/ctrls/financeProduce.js?v=18110801a']
        //                 }
        //             ]);
        //         }
        //     }
        // })

        .state('sys', {
            abstract: true,
            url: '/sys',
            templateUrl: viewportURL('content')
        })
        .state('sys.set', {
            url: '/set',
            templateUrl: templateURL('sys_set'),
            data: {pageTitle: '系统配置'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'angular-ladda',
                            files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
                        },
                        {
                            serie: true,
                            name: 'daterangepicker',
                            files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
                        },
                        {
                            files: ['src/js/ctrls/sysSet.js?v=18110801a']
                        }
                    ]);
                }
            }
        })

        .state('sys.code', {
            url: '/code',
            templateUrl: templateURL('sys_code'),
            data: {pageTitle: '活动设置'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'angular-ladda',
                            files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
                        },
                        {
                            serie: true,
                            name: 'daterangepicker',
                            files: ['src/css/plugins/daterangepicker/daterangepicker-bs3.css', 'src/js/plugins/moment/moment.min.js', 'src/js/plugins/daterangepicker/daterangepicker.js', 'src/js/plugins/daterangepicker/angular-daterangepicker.js']
                        },
                        {
                            files: ['src/js/ctrls/sysCode.js?v=18110801a']
                        }
                    ]);


                }
            }
        })

        .state('sys.dbBackUp', {
            url: '/dbBackUp',
            templateUrl: templateURL('sysDbBackUp'),
            data: {pageTitle: '数据库备份'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            name: 'angular-ladda',
                            files: ['src/css/plugins/ladda/ladda-themeless.min.css', 'src/js/plugins/ladda/spin.min.js', 'src/js/plugins/ladda/ladda.min.js', 'src/js/plugins/ladda/angular-ladda.min.js']
                        },
                        {
                            files: ['src/js/ctrls/sysDbBackUp.js?v=18110801a']
                        }
                    ]);


                }
            }
        });

}

//Every page router config
angular.module('zm').config(config).run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});