/**
 * ZM
 * Main directives.js file
 * Define directives for used plugin
 *
 * Functions (directives)
 *  - sideNavigation
 *  - minimalizaSidebar
 *  - closeOffCanvas
 *  - iboxTools
 *  - iboxToolsFullScreen
 *  - fullScroll
 *  - slimScroll
 *  - fitHeight
 *  - icheck
 *  - clockPicker
 *  - vCode
 *  - eCharts
 *  - imgUpload
 *  - imgView
 *  - joinUpload
 *  - mapPicker
 */

/* pageTitle - Directive for set Page title - mata title */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = '管理平台';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            }
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
}

/* sideNavigation - Directive for run metsiMenu on sidebar navigation */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });

            // Colapse menu in mobile mode after click on element
            var menuElement = $('#side-menu a:not([href$="\\#"])');
            menuElement.click(function () {
                if ($(window).width() < 769) {
                    $("body").toggleClass("mini-navbar");
                }
            });

            // Enable initial fixed sidebar
            if ($("body").hasClass('fixed-sidebar')) {
                var sidebar = element.parent();
                sidebar.slimScroll({
                    height: '100%',
                    railOpacity: 0.9,
                });
            }
        }
    }
}

/* minimalizaSidebar - Directive for minimalize sidebar */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(function () {
                        $('#side-menu').fadeIn(400);
                    }, 200);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(function () {
                        $('#side-menu').fadeIn(400);
                    }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    }
}

function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    }
}

/* iboxTools - Directive for iBox tools elements in right corner of ibox */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.children('.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            }
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
        }
    }
}

/* iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.children('.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            }
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function () {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    }
}

/* fullScroll - Directive for slimScroll with 100% */
function fullScroll($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });
            });
        }
    }
}

/* slimScroll - Directive for slimScroll with custom height */
function slimScroll($timeout) {
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });
            });
        }
    }
}

/* fitHeight - Directive for set height fit to window height */
function fitHeight() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    }
}

/* icheck - Directive for custom checkbox icheck */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, element, $attrs, ngModel) {
            return $timeout(function () {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function (newValue) {
                    $(element).iCheck('update');
                });

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function (event) {
                    if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                        $scope.$apply(function () {
                            return ngModel.$setViewValue(event.target.checked);
                        });
                    }
                    if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                        return $scope.$apply(function () {
                            return ngModel.$setViewValue(value);
                        });
                    }
                });
            });
        }
    }
}

/* touchSpin - Directive for Bootstrap TouchSpin */
function touchSpin() {
    return {
        restrict: 'A',
        scope: {
            spinOptions: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.spinOptions, function () {
                render();
            });
            var render = function () {
                $(element).TouchSpin(scope.spinOptions);
            }
        }
    }
}

/* clockPicker */
function clockPicker() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.clockpicker();
        }
    }
}

/* vCode */
function vCode($interval, $timeout) {
    return {
        restrict: 'AE',
        require: '?^ngModel',
        scope: {
            type: '@',
            length: '@',
            counter: '='
        },
        link: function (scope, element, attrs, ngModel) {
            if (attrs.$attr.type) {
                if (attrs.$attr.ngModel) {
                    //counter
                    if (scope.type == 'count' || scope.type == 'button') {
                        var el = element[0];
                        ngModel.$setViewValue('获取验证码');
                        scope.$watch(attrs.$attr.counter, function () {
                            if (scope.counter) {
                                var count = 60,
                                    interval = $interval(function () {
                                        if (count == 0) {
                                            $interval.cancel(interval);
                                            ngModel.$setViewValue('获取验证码');
                                            el.disabled = false;
                                            scope.counter = false;
                                        } else {
                                            count -= 1;
                                            el.disabled = true;
                                            ngModel.$setViewValue(count + 's');
                                        }
                                    }, 1000);
                            }
                        });

                    } else if (scope.type == 'code') {  //verify code
                        var code = '', len = 6,
                            codes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                        if (attrs.$attr.length) len = scope.length;
                        for (var i = 0; i < len; i++) {
                            var idx = Math.floor(Math.random() * 36);
                            //随机产生大小写
                            idx % 2 ? code += codes[idx] : code += angular.lowercase(codes[idx]);
                        }
                        ngModel.$setViewValue(code);
                    }

                } else {
                    console.warn('ngModel ' + attrs.ngModel + ' undefined');
                }

            } else {
                console.warn('missed scope["type"] or undefined');
            }
        }
    }
}

/* eCharts
 * scope.options {object}  --图表配置对象
 *
 * options.theme {string}  --图表主题
 * options.renderer {string}  --图表渲染器模式
 * options.showLoading {boolean}  --是否显示加载提示
 * options.showTitle {boolean}  --是否显示图表标题
 * options.title {string}  --图表标题
 * options.subTitle {string}  --图表副标题
 * options.showTooltip {boolean}  --是否显示hover气泡
 * options.tooltipFormat {string}  --气泡展示的数据格式
 * options.showToolbox {boolean}  --是否显示图表工具栏
 * options.toolboxFeature {object}  --工具栏开启的功能选项
 * options.showLegend {boolean}  --是否显示图表的类目
 * options.legendData {array}  --图表类目数据组
 * options.xType {string}  --图表X轴数据类型
 * options.xData {array}  --图表X轴数据组
 * options.yType {string}  --图表Y轴数据类型
 * options.series {object}  --图表数据内容对象
 *
 * options.series
 * series.type {string}  --图表样式类型，如line/pie/bar
 * series.name {string}  --对应类目legendData中的类目名，如销量/业绩等
 * series.data {array}  --对应类目下的不同数据组
 * */
function eCharts($timeout) {
    return {
        restrict: 'AE',
        scope: {
            options: '='
        },
        link: function (scope, element, attrs) {
            $timeout(function () {
                scope.$watch(attrs.$attr.options, function () {
                    if (attrs.$attr.options && angular.isObject(scope.options)) {
                        var ops = scope.options,
                            container = element[0],
                            theme = ops.theme || 'default',
                            isMap = ops.isMap || false,
                            eChart = echarts.init(container, theme, {renderer: ops.renderer || 'canvas'}), eCharts = [],
                            series = [], options = {};
                        eCharts.push(eChart);
                        if (ops.showLoading) {
                            eChart.showLoading();
                            $timeout(function () {
                                eChart.hideLoading();
                            }, 800);
                        }
                        if (isMap) {
                            options = ops.option;

                        } else {
                            //配置图表显示类型
                            angular.forEach(ops.series, function (item, i) {
                                if (angular.isString(item.type)) {
                                    switch (item.type) {
                                        case 'line': {
                                            var serie = {
                                                type: 'line',
                                                name: item.name,  //类目名
                                                areaStyle: item.areaStyle || null,
                                                smooth: true,  //线条平滑过渡
                                                data: item.data || []
                                            };
                                            series.push(serie);
                                            break;
                                        }
                                        case 'bar': {
                                            var serie = {
                                                type: 'bar',
                                                name: item.name,  //类目名
                                                barMaxWidth: item.barMaxWidth || 10, //柱子宽度
                                                label: {
                                                    normal: {
                                                        show: true,
                                                        position: ['50%', '15%'],
                                                        formatter: '{c}',
                                                        fontSize: 12,
                                                        textStyle: {
                                                            color: '#333333'
                                                        },
                                                        align: 'middle',
                                                        verticalAlign: 'middle',
                                                        rotate: 90
                                                    }
                                                },
                                                itemStyle: {
                                                    normal: {
                                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                            offset: 0,
                                                            color: '#f9e27b'
                                                        }, {
                                                            offset: 1,
                                                            color: '#ffd101'
                                                        }]),
                                                        opacity: 1,
                                                    }
                                                },
                                                data: item.data || []
                                            };
                                            series.push(serie);
                                            break;
                                        }
                                        case 'pie': {
                                            var serie = {
                                                type: 'pie',
                                                name: item.name,  //类目名
                                                radius: item.radius || '55%',
                                                center: item.center || ['50%', '50%'],
                                                avoidLabelOverlap: false,
                                                label: {
                                                    normal: {
                                                        show: true,
                                                        fontSize: 10,
                                                        textStyle: {
                                                            color: '#333333'
                                                        },
                                                        formatter: '{b}\n{d}%'
                                                    }
                                                },
                                                itemStyle: {
                                                    normal: {
                                                        label: {
                                                            show: true,
                                                            formatter: '{b}\n{d}%',
                                                            textStyle: {
                                                                color: '#333333'
                                                            }
                                                        },
                                                        labelLine: {
                                                            show: true
                                                        }
                                                    }
                                                },
                                                color: item.colors || [],
                                                data: item.data || []
                                            };
                                            series.push(serie);
                                            break;
                                        }
                                        default: {
                                            series = [{
                                                type: 'line',
                                                name: '',  //类目名
                                                areaStyle: null,
                                                data: []
                                            }];
                                        }
                                    }
                                }
                            })
                            options = {
                                backgroundColor: ops.bgColor || '#ffffff',
                                title: {
                                    show: ops.showTitle || false,
                                    text: ops.title || '标题',
                                    subtext: ops.subTitle || '',
                                    left: 'left',
                                    textStyle: {
                                        color: '#333333'
                                    }
                                },
                                //鼠标hover气泡提示739669576
                                tooltip: {
                                    show: ops.showTooltip || true,
                                    trigger: 'axis',  //触发点
                                    axisPointer: {
                                        type: 'cross',  //鼠标类型
                                        label: {
                                            backgroundColor: '#6a7985'
                                        }
                                    },
                                    textStyle: {
                                        color: '#333333'
                                    },
                                    formatter: ops.tooltipFormat || ''
                                },
                                //工具
                                toolbox: {
                                    show: ops.showToolbox || true,
                                    orient: 'horizontal',
                                    showTitle: true,
                                    itemSize: 10, //图标大小
                                    itemGap: 5,  //图标间隔
                                    feature: ops.toolboxFeature || {  //开启的功能
                                        dataView: {
                                            show: false,
                                            readOnly: false
                                        },
                                        magicType: {
                                            show: false,
                                            type: ['line', 'bar']
                                        },
                                        saveAsImage: {
                                            show: false
                                        }
                                    }
                                },
                                grid: {
                                    top: ops.grid && ops.grid.top ? ops.grid.top : 40,
                                    right: ops.grid && ops.grid.right ? ops.grid.right : 30,
                                    bottom: ops.grid && ops.grid.bottom ? ops.grid.bottom : 40,
                                    left: ops.grid && ops.grid.left ? ops.grid.left : 30
                                },
                                //类目
                                legend: {
                                    show: ops.showLegend || false,
                                    itemWidth: 10,  //显示大小
                                    itemHeight: 10,
                                    orient: 'horizontal',
                                    data: ops.legendData || [],

                                },
                                xAxis: {
                                    type: ops.xType || 'category',
                                    show: ops.xAxisShow || false,
                                    //name: 'x轴名称',
                                    nameLocation: 'center',  //显示位置
                                    nameGap: 15,  //距离图表间隔
                                    nameTextStyle: {
                                        color: '#333333'
                                    },
                                    boundaryGap: true,  //类目是否显示在刻度空白之间
                                    axisTick: {
                                        show: true,
                                    },
                                    axisLabel: {
                                        interval: 0,
                                        rotate: ops.xRotate || 0,
                                    },
                                    data: ops.xData || []
                                },
                                yAxis: {
                                    type: ops.yType || 'value',
                                    show: ops.yAxisShow || false,
                                    //name: 'y轴名称',
                                    splitLine: {
                                        show: false
                                    },
                                    nameLocation: 'center',
                                    nameGap: 15,
                                    nameTextStyle: {
                                        color: '#333333'
                                    },
                                    axisTick: {
                                        show: true
                                    },
                                    axisLabel: {
                                        interval: 0,
                                        rotate: ops.yRotate || 0
                                    }
                                },
                                series: series || []
                            }
                        }
                        //配置图表
                        eChart.setOption(options);

                        //自适应宽高
//				    	scope.resize = function() {
//				       		return {
//				       			w: container.clientWidth,
//				       			h: container.clientHeight
//				       		}
//				    	}
//				    	scope.$watch(scope.resize, function(n, o) {
//				       		container.children[0].style.width = o.w;
//				       		container.children[0].style.height = o.h;
//				       		$timeout(function() {
//				       			eChart.resize();
//				       		}, 100);
//				    	}, true);
                        $timeout(function () {
                            window.addEventListener('resize', function (e) {
                                for (var i = 0; i < eCharts.length; i++) {
                                    eCharts[i].resize();
                                }
                            });
                        }, 50);

                    } else {
                        console.warn('missed scope["options"] or scope["options"] not an object!');
                    }
                }, true);
            }, 1000);
        }
    }
}

/* imgs upload
 * scope.options {object}  --上传照片的配置对象
 * scope.query {string}  --上传照片的额外参数
 * scope.placeholder {string}  --提示语句，可选
 * scope.disabled {boolean}  --禁止使用该指令的条件，布尔类型，默认不存在为false
 *
 * scope.options
 * options.url {string}  --上传照片的服务器url
 * options.size {number}  --限制上传照片的大小，默认单位是M
 * options.width {number}  --限制上传照片的宽度，默认单位是px
 * options.height {number}  --限制上传照片的搞度，默认单位是px
 * options.length {number}  --限制上传照片的数量，默认1张
 * options.disabled {function}  --禁止使用该指令的时候调用该回调函数，可选
 *
 * */
function imgUpload($timeout, $http, $modal, pop) {
    return {
        restrict: 'AE',
        require: '?^ngModel',
        scope: {
            options: '=',
            query: '@',
            disabled: '@',
            placeholder: '@'
        },
        replace: true,
        template: '<div class="upload">'
            + '<div class="upload-wrp">'
            + '<label class="upload-label preview" ng-repeat="item in imgs track by $index">'
            + '<img class="upload-img" ng-src="{{item}}" ng-click="preview($event)">'
            + '<span class="upload-img-close" ng-click="remove($index, $event)"></span>'
            + '</label>'
            + '<label class="upload-label" ng-class="{' + "'uploading': uploading" + '}" ng-show="showInput">'
            + '<input class="upload-input" type="file" accept="image/*">'
            + '<span class="loading circle"></span>'
            + '</label>'
            + '</div>'
            + '<p class="upload-placeholder" ng-class="{' + "'invisible': imgs.length" + '}">{{placeholder || "请选择需要上传的图片"}}</p>'
            + '</div>',
        link: function (scope, elem, attrs, ngModel) {
            $timeout(function () {
                //默认显示上传按钮
                scope.showInput = true;
                scope.uploading = false;
                scope.imgs = [];  //创建imgs存储容器
                if (angular.isObject(scope.options)) {
                    //获取空间对应的节点
                    var uploadWrp = elem[0].children[0],
                        uploadLabels = uploadWrp.children,
                        uploadLabel = uploadLabels[uploadLabels.length - 1],
                        uploadInput = uploadLabel.children[0],
                        config = {  //初始化默认配置，在用户没有自定义options的时候使用
                            url: scope.options.url || '',
                            size: scope.options.size || 2,
                            width: scope.options.width || '',
                            height: scope.options.height || '',
                            length: scope.options.length || 1,
                            disabled: scope.options.disabled || '',
                        };

                    //监听DOM中数据的变化用以改变控件的配置
                    scope.$watch(attrs.$attr.options, function (n, o) {
                        angular.extend(config, n);
                    }, true);

                    if (window.FileReader) {
                        //判断是否在父控制器里面设定了默认ngModel的值，如果有则显示传过来的图片
                        if (ngModel.$viewValue && angular.isArray(ngModel.$viewValue)) {
                            var mdLen = ngModel.$viewValue.length;
                            if (mdLen) {  //判断显示图片，一般用于编辑的时候传过来显示服务器中已存在的图片
                                if (mdLen > config.length) {
                                    scope.showInput = false;
                                    scope.imgs = ngModel.$viewValue.slice(0, config.length);
                                    ngModel.$setViewValue(scope.imgs);
                                } else {
                                    if (mdLen == config.length) scope.showInput = false;
                                    scope.imgs = ngModel.$viewValue;
                                }

                            }

                        } else {
                            console.warn('ngModel ' + attrs.ngModel + ' undefined or not an Array, so do not display any img');
                        }

                        //upload主逻辑
                        uploadInput.addEventListener('change', function (e) {
                            //如果设定了禁用该控件的条件，则判断条件是否成立，成立则禁用空控件
                            if (attrs.$attr.disabled && !scope.disabled) {  //如果disabled属性存在，且disable属性绑定的条件为false即非真，则禁用控件
                                if (config.disabled && angular.isFunction(config.disabled)) config.disabled();
                                this.value = '';
                                return;

                            } else {
                                var $this = this,
                                    file = e.target.files[0],
                                    fileName = file.name,
                                    fileType = file.type,
                                    fileSize = file.size / (Math.pow(1024, 2)), //file.size/(Math.pow(1024,2))可以转换成单位M，如果后面是1则转为KB单位，input获取到的文件大小为byte（字节）
                                    maxSize = config.size;

                                //判断图片类型是否符合规格
                                if (/^(image\/png|image\/jpg|image\/jpeg)$/i.test(fileType)) {
                                    //判断图片size是否符合规格
                                    if (fileSize > maxSize) {
                                        $this.value = '';
                                        pop.usual({
                                            title: '温馨提示',
                                            msg: '图片最大为' + maxSize + 'M，请重新选择！'
                                        });
                                        return;

                                    } else {
                                        //如果图片类型和大小都符合规格，则开始读取图片数据
                                        var reader = new FileReader();
                                        reader.readAsDataURL(file);  //reader读取图片数据后转换成的base64图片数据
                                        reader.onload = function (e) {
                                            //result为reader读取图片数据后转换成的base64图片数据，通过new Image对象获取图片的真实宽高
                                            var result = this.result,
                                                img = new Image();
                                            img.onload = function () {
                                                var imgW = this.width, imgH = this.height,
                                                    maxW = config.width, maxH = config.height,
                                                    imgBlob = dataURLtoBlob(result),  //将加载完的图片转成二进制流
                                                    fd = new FormData();
                                                fd.append('image', imgBlob);  //把二进制流填充到表单数据

                                                //判断图片宽高是否符合规格
                                                if (maxW && maxH) {
                                                    if (imgW > maxW || imgH > maxH) {
                                                        pop.usual({
                                                            title: '温馨提示',
                                                            msg: '上传的图片最大尺寸为' + maxW + 'px * ' + maxH + 'px！'
                                                        });
                                                        return;
                                                    }

                                                } else if (maxW) {
                                                    if (imgW > maxW) {
                                                        pop.usual({
                                                            title: '温馨提示',
                                                            msg: '上传的图片的宽最大尺寸为' + maxW + 'px！'
                                                        });
                                                        return;
                                                    }

                                                } else if (maxH) {
                                                    if (imgH > maxH) {
                                                        pop.usual({
                                                            title: '温馨提示',
                                                            msg: '上传的图片的高最大尺寸为' + maxH + 'px！'
                                                        });
                                                        return;
                                                    }
                                                }
                                                //如果图片大小符合规格，则上传图片
                                                if (scope.query) config.url = config.url + scope.query;
                                                scope.uploading = true;
                                                $http({
                                                    method: 'POST',
                                                    url: config.url,
                                                    data: fd,
                                                    transformRequest: angular.identity,
                                                    headers: {'Content-Type': undefined}

                                                }).then(function (res) {
                                                    var status = res.data.status;
                                                    scope.uploading = false;
                                                    $this.value = '';
                                                    if (status == 200) {
                                                        scope.imgs.push(res.data.data.imgUrl);
                                                        //将已上传的图片url传播给ngModel
                                                        ngModel.$setViewValue(scope.imgs);
                                                        //判断图片数量显示上传按钮
                                                        if (scope.imgs.length >= config.length) scope.showInput = false;

                                                    } else {
                                                        pop.usual({
                                                            title: '上传失败',
                                                            msg: res.data.msg
                                                        });
                                                        return
                                                    }
                                                });
                                            }
                                            //必须先绑定Image对象的onload事件，才能设置src属性，否则会出同步问题。
                                            img.src = result;
                                        }
                                    }

                                } else {
                                    //如果图片类型不符合规格
                                    pop.usual({
                                        title: '温馨提示',
                                        msg: '请选择格式为png/jpg/jpeg的图片!'
                                    });
                                    $this.value = ''; //清空已选择的不符合条件的值，避免无法再次弹出错误提示
                                    return;
                                }
                            }
                        });

                        //remove or open preview img
                        scope.remove = function (i, e) {
                            scope.imgs.splice(i, 1);
                            //重新赋值给ngModel
                            ngModel.$setViewValue(scope.imgs);
                            //重新显示上传按钮
                            if (scope.imgs.length < config.length) scope.showInput = true;
                        }
                        scope.preview = function (e) {
                            $modal.open({
                                template: '<div class="inmodal">'
                                    + '<div class="modal-header">'
                                    + '<h6 class="modal-title">预览</h6>'
                                    + '</div>'
                                    + '<div class="modal-body no-padding">'
                                    + '<img class="w-100p h-100p" ng-src="{{uri}}">'
                                    + '</div>'
                                    + '<div class="modal-footer text-center">'
                                    + '<button type="button" class="btn btn-primary" ng-click="close()">关闭</button>'
                                    + '</div>'
                                    + '</div>',
                                controller: function ($scope, $modalInstance) {
                                    $scope.uri = e.target.src;
                                    $scope.close = function () {
                                        $modalInstance.close();
                                    };
                                },
                                size: 'md',
                                backdrop: 'static'
                            });
                        }

                        //转换成二进制文件流
                        function dataURLtoBlob(dataUrl) {
                            var arr = dataUrl.split(','),
                                mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[1]),
                                n = bstr.length,
                                u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new Blob([u8arr], {type: mime});
                        }

                    } else {
                        uploadInput.addEventListener('click', function (e) {
                            e.preventDefault();
                            pop.usual({
                                title: '温馨提示',
                                msg: '您的浏览器不支持FileReader，请更升级到最新版本或者更换浏览器再试试~'
                            });
                        });
                    }
                } else {
                    console.warn('scope["options"] not an object!');
                }
            }, 10);
        }
    }
}

/* imgs preview */
function imgView($timeout, $modal) {
    return {
        restrict: 'AE',
        scope: {
            size: '@'
        },
        controller: function ($scope, $element, $attrs) {
            $timeout(function () {
                $element.click(function () {
                    $modal.open({
                        template: '<div class="inmodal">'
                            + '<div class="modal-header">'
                            + '<h6 class="modal-title">预览</h6>'
                            + '</div>'
                            + '<div class="modal-body no-padding">'
                            + '<img class="w-100p h-100p" ng-src="{{uri}}">'
                            + '</div>'
                            + '<div class="modal-footer text-center">'
                            + '<button type="button" class="btn btn-primary" ng-click="close()">关闭</button>'
                            + '</div>'
                            + '</div>',
                        controller: function ($scope, $modalInstance) {
                            $scope.uri = $attrs.src;
                            $scope.close = function () {
                                $modalInstance.close();
                            };
                        },
                        size: $scope.size || 'sm',
                        backdrop: 'static'
                    });
                });
            });
        }
    }
}

/* map picker
 * scope.options {object}  --上传照片的配置对象
 *
 * scope.options
 * options.name {string}   --密钥key对应的appName
 * options.key {string}    --腾讯地图密钥key
 *
 * */
function mapPicker($timeout, $sce, pop) {
    return {
        restrict: 'AE',
        require: '?^ngModel',
        scope: {
            options: '='
        },
        replace: true,
        template: '<div class="map-picker">'
            + '<iframe class="map-iframe" ng-src="{{config}}"></iframe>'
            + '</div>',
        link: function (scope, elem, attrs, ngModel) {
            $timeout(function () {
                //配置地图
                if (scope.options) {
                    scope.config = $sce.trustAsResourceUrl('https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=' + scope.options.key + '&referer=' + scope.options.name);
                } else {
                    console.warn('The map component missed options');
                }

                //监听地图选择事件
                window.addEventListener('message', function (e) {
                    var local = e.data;
                    if (local && local.module == 'locationPicker') {
                        ngModel.$setViewValue({
                            latng: local.latlng,     //经纬度
                            city: local.cityname,    //城市名称
                            poiname: local.poiname,  //地标名称
                            addr: local.poiaddress   //详细地址
                        });
                    }
                });

            }, 10);
        }
    }
}

function udScroll($timeout) {
    return {
        restrict: 'AE',
        scope: {
            options: '='
        },
        link: function ($scope, $element, $attrs) {
            $timeout(function () {
                $scope.$watch($attrs.options, function () {
                    var $item_con = $element.children('#orderItem'),
                        wrap_hei = $element[0].clientHeight,
                        item_hei = $item_con.height(),
                        count = 0;
                    flag = true;
                    distance = wrap_hei - 53;
                    timer = null;
                    timer = setInterval(function () {
                        count -= 1;
                        if (Math.abs(count) < item_hei) {
                            if ($item_con.hasClass('hide')) {
                                $item_con.removeClass('hide');
                            }
                            $item_con.css({
                                '-webkit-transform': 'translateY(' + count + 'px)',
                                'transform': 'translateY(' + count + 'px)',
                            });
                        } else {
                            $item_con.addClass('hide');
                            count = distance;
                            $item_con.css({
                                '-webkit-transform': 'translateY(' + count + 'px)',
                                'transform': 'translateY(' + count + 'px)',
                            });
                        }

                    }, 50);

                }, true);
            }, 2000)
        }
    }
}

/* Pass all functions into module */
angular.module('zm')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('iboxTools', iboxTools)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('fullScroll', fullScroll)
    .directive('slimScroll', slimScroll)
    .directive('fitHeight', fitHeight)
    .directive('icheck', icheck)
    .directive('touchSpin', touchSpin)
    .directive('clockPicker', clockPicker)
    .directive('vCode', vCode)
    .directive('eCharts', eCharts)
    .directive('imgUpload', imgUpload)
    .directive('imgView', imgView)
    .directive('mapPicker', mapPicker)
    .directive('udScroll', udScroll);