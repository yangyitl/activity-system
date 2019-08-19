angular.module('ui.switchery', [])
    .directive('uiSwitch', ['$window', '$timeout','$log', '$parse', function($window, $timeout, $log, $parse) {

        /**
         * Initializes the HTML element as a Switchery switch.
         *
         * @TODO add a way to provide options for Switchery
         * $timeout is in place as a workaround to work within angular-ui tabs.
         *
         * @param scope
         * @param elem
         * @param attrs
         */
        'use strict';
        function linkSwitchery(scope, elem, attrs, ngModel) {
            if(!ngModel) return false;
            var options = {};
            try {
                options = $parse(attrs.uiSwitch)(scope);
            }
            catch (e) {}
            $timeout(function() {
                var switcher = new $window.Switchery(elem[0], options);
                var element = switcher.element;
                if (attrs.uiSwitchIf == ngModel.$modelValue) {
                	element.checked = true;
                } else {
                	element.checked = false;
                }
                switcher.setPosition(false);
                element.addEventListener('change',function(evt) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(element.checked);
                    });
                    console.log(33)
                })
            }, 0);
        }
        return {
            require: 'ngModel',
            restrict: 'AE',
            link: linkSwitchery
        }
    }]);