define(["angular"], function() {

    return function(module) {
        module.directive('onLastRow', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            console.log("Emitting " + attr.onLastRow);
                            scope.$emit(attr.onLastRow);
                        });
                    }
                }
            }
        });
    }
})
