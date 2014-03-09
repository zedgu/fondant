'use strict';

angular.module('siteApp')
  .directive('fdCode', function () {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope, $element){
        var html = $element[0].previousElementSibling.innerHTML;
        $scope.code = html.replace(new RegExp('\n'+html.match(/( +)</)[1], 'g'), '\n');
      }
    };
  });
