'use strict';

angular.module('siteApp')
  .controller('DocsCtrl', function ($scope, $routeParams, $location) {
    $scope.menuData = {
      'css': {
        'Base CSS': ['Text', 'Grid', 'Button', 'Container', 'List', 'Form']
      }
    };
    $scope.category = $routeParams.category;
    $scope.detail = $routeParams.detail;
    $scope.data = $scope.menuData[$scope.category];
    $scope.include = '/views/' + $scope.category + '/' + ($scope.detail || 'index') + '.html';
    if ($scope.data) {
      if(!$scope.detail) {
        $location.path('/docs/' + $scope.category);
        return;
      }
    } else {
      $location.path('/');
      return;
    }
  });
