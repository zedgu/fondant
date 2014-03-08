'use strict';

angular.module('siteApp')
  .directive('fdCode', function () {
    return {
      template: '<pre></pre>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var html = element[0].previousElementSibling.innerHTML;
        Rainbow.color(html.replace(new RegExp(html.match(/( +)</)[1], 'g'), ''), attrs.fdCode, function(code) {
          console.log(code);
          element.children().append(code);
        });
      }
    };
  });
