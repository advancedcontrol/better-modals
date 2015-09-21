(function (angular) {
    'use strict';


    // Mix in to our module
    var module;
    try {
        module = angular.module('coUtils');
    } catch (e) {
        module = angular.module('coUtils', []);
    }


    // Globals
    var container = document.createElement('div');

    // This is where our popup elements will reside
    container = angular.element(container);
    container.attr('id', 'modals');
    angular.element(document.body).append(container);


    module
        .directive('modal', ['$timeout', '$animate', function($timeout, $animate) {
            return {
                scope: {
                    title: '@',
                    show: '=',
                    visible: '=?'
                },
                restrict: 'E',
                transclude: true,
                template:
                    '<div ng-cloak ng-touch="close($event)">' +
                        '<div>' +
                            '<div class="modal-header"><h1>{{title}}</h1>' +
                                '<span ng-if="showClose" class="close" ng-touch="close($event)"></span>' +
                            '</div>' +
                            '<div class="modal-content" ng-transclude></div>' +
                        '</div>' +
                    '</div>',
                link: function(scope, element, attrs) {
                    var show = function () {
                            container.append(element);
                            scope.show = scope.visible = true;
                            return $animate.addClass(element, 'coModal');
                        },
                        close = function () {
                            return $animate.removeClass(element, 'coModal').then(function () {
                                // Scope may have been destroyed at this point
                                if (element) {
                                    element.detach();
                                    scope.show = scope.visible = false;
                                }
                            });
                        };


                    // Setup the element
                    scope.visible = false;
                    element.addClass(attrs.animation || 'bounceInRight');
                    scope.showClose = !attrs.hasOwnProperty('noClose');

                    // Watch to see if the modal should be showing or not
                    scope.$watch('show', function (showing) {
                        if (showing && !scope.visible) {
                            show();
                        } else if (!showing && scope.visible) {
                            close();
                        }
                    });
                    
                    // So the element can close itself
                    scope.close = function (e) {
                        if (scope.showClose) {
                            close();
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    };

                    // Detach the element from the DOM
                    element.detach();

                    // On destroy, unregister the popup
                    scope.$on('$destroy', function () {
                        close()['finally'](function () {
                            element.remove();
                            element = null;
                        });
                    });
                }
            };
        }]);

}(this.angular));
