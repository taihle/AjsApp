// ------------------------------------------------------------------------------
// Author: Tai H. Le <taihle@gmail.com>
//
// Custome directives
// ------------------------------------------------------------------------------

ajsApp.directive('myPassword', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, mCtrl){
            mCtrl.$parsers.push(function(value){
                var aryValue = value.split("");
                var isChar = false, isDigit = false;

                aryValue.forEach(function(element, index, array){
                    if (Number.isInteger(parseInt(element))){
                        isDigit = true;
                    }else{
                        isChar = true;
                    }
                })

                mCtrl.$setValidity('myPassword', isDigit && isChar);

                return value;
            });
        }
    };
});

ajsApp.directive('compareTo', function(){
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel){
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});

ajsApp.directive('onErrorSrc', function() {
    return {
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            if (attrs.src != attrs.onErrorSrc) {
              attrs.$set('src', attrs.onErrorSrc);
            }
          });
        }
    }
});

ajsApp.directive('scrollBottom', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            scrollBottom: "<"
        },
        link: function (scope, element) {
            scope.$watchCollection('scrollBottom', function (newValue) {
                if (newValue)
                {
                    $timeout(function(){
                        element[0].scrollTop = element[0].scrollHeight;
                    }, 100);
                }
            });
        }
    }
}]);