'use strict';

angular.module('siteApp')
  .directive('fdCode', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var html = element[0].previousElementSibling.innerHTML;
        scope.code = html.replace(new RegExp(html.match(/( +)</)[1], 'g'), '');
      }
    };
  });
