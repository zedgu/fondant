'use strict';

angular.module('siteApp')
  .directive('fdCode', function () {
    return {
      restrict: 'A',
      scope: true,
      controller: function($scope, $element, $attrs){
        var html = $element[0].previousElementSibling.innerHTML
          , code = html.replace(new RegExp('\n'+html.match(/( +)/)[1], 'g'), '\n').replace(/^\s*/, '').replace(/\s*$/, '')
          , replaces = $attrs.format ? $attrs.format.split('|') : false
          , replaceWords;
        if (replaces) {
          for (var i = 0; i < replaces.length; i++) {
            replaceWords = replaces[i].split(',');
            code = code.replace(new RegExp(replaceWords[0].replace(/''/g, '"')), replaceWords[1]);
          }
        }
        code = code.replace(/\ ?ng-[\w-]*/g, '');
        code = code.replace(/\ ?class=""/g, '');
        code = code.replace(/(fd-?\w*)=""/g, '$1');
        $scope.code = code;
      }
    };
  });
