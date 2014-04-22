'use strict';

angular.module('fondant', [])

.factory('fondantGroup', [function(){
  var groups = {}
    , Group = function() {
      this.$items = {
        'trigger': [],
        'target': []
      };
      this.$current = null;
      this.$off = angular.noop;
    };
  Group.prototype.get = function(type, index) {
    var item = this.$items[type] || this.set(type);

    if (angular.isNumber(index)) {
      item = angular.element(item).eq(index);
    }
    return item;
  };
  Group.prototype.set = function(type, setting) {
    this.$items[type] = angular.isDefined(setting) ? setting : [];
    return this.$items[type];
  };
  Group.prototype.add = function(type, element) {
    return this.get(type).push(element) - 1;
  };
  Group.prototype.index = function(type, element) {
    return this.get(type).indexOf(element);
  };
  Group.prototype.current = function(index) {
    if (angular.isDefined(index)) {
      this.$current = index;
    } else {
      return this.$current;
    }
  };
  Group.prototype.off = function(fn) {
    if (angular.isFunction(fn)) {
      this.$off = fn;
    }
    return this.$off;
  };
  Group.prototype.target = function(index) {
    return this.get('target', index);
  };
  Group.prototype.rotate = function(index, type, className) {
    className = className || 'show';
    type = type || 'target';
    if (this.current() === null) {
      this.current(0);
    }
    if (index !== this.current()) {
      this.get(type, this.current()).removeClass(className);
    }
    this.get(type, index).addClass(className);
    this.current(index);
  };
  // Group.prototype.open = function(index, className, type) {
  //   className = className || 'show';
  //   this.get(type, index).addClass(className);
  // };
  // Group.prototype.close = function(className, type) {
  //   className = className || 'show';
  //   type = type || 'target';

  //   this.get(type, this.current()).removeClass(className);
  //   this.current(null);
  // };

  return {
    get: function(groupName, types) {
      var group = groups[groupName];
      // console.log(groups);
      if (group) {
        return group;
      } else {
        return this.set(groupName, types);
      }
    },
    set: function(groupName, types) {
      groups[groupName] = new Group(types);
      return groups[groupName];
    },
    create: function(types) {
      return new Group(types);
    }
  };
}])
.factory('fondant', [function(){
  return {
  };
}])

.directive('fd', [function(){
  return {
    scope: true,
    restrict: 'A',
    controller: function($scope, $element) {
      $element.css('position', 'relative');
    }
  };
}])
.directive('filefield', [function(){
  return {
    restrict: 'C',
    scope: true,
    link: function(scope, element) {
      var inputs = element.find('input')
        , file
        , show;
      for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type === 'file') {
          file = inputs.eq(i);
        } else {
          show = inputs.eq(i);
        }
      }
      file.bind('change', function() {
        show.val(this.value.split('\\').pop());
      });
    }
  };
}])

.directive('fdDropdown', ['$document', '$timeout', 'fondantGroup', function($document, $timeout, fondantGroup) {
  return {
    restrict: 'A',
    scope: {
      ev: '@fdDropdown',
      group: '@'
    },
    controller: function($scope, $element, $attrs) {
      $scope.groupName = $attrs.fdDropdown || '$$' + $scope.$parent.$id + '.dropdown';
      var group = fondantGroup.get($scope.groupName)
        , type = $element.hasClass('dropdown') ? 'target' : 'trigger'
        // , bindEvent = events[$attrs.fdEvent] || events.click
        , index = group.add(type, $element[0]);

      $scope.$watch('$location.path', group.off());

      if (type === 'trigger') {
        $element.bind('mouseenter', function(event) {
          // $scope.isOpened 
          event.preventDefault();
          event.stopPropagation();

          if ($scope.isOpened) {
            $timeout.cancel($scope.timeout);
          } else {
            if (!$element.hasClass('disabled') && !$element.prop('disabled')) {
              group.off(function() {
                $document.unbind('click', group.off());
                group.target(index).removeClass('show');
                group.off(angular.noop);
                $scope.isOpened = false;
              });
              console.log(group);

              group.target(index).addClass('show');
              $scope.isOpened = true;
              $document.bind('click', group.off());
            }
          }
        });
      }

      // element.bind(ev, function (event) {

      //   scope.isOpened = (element === openElement);

      //   event.preventDefault();
      //   event.stopPropagation();

      //   if (scope.isOpened) {
      //     $timeout.cancel(scope.timeout);
      //     return;
      //   }
      //   // if (!!openElement) {
      //   //   closeMenu();
      //   // }

      //   if (!scope.isOpened && !element.hasClass('disabled') && !element.prop('disabled')) {
      //     element.next().addClass('show');
      //     openElement = element;
      //     closeMenu = function (event) {
      //       if (event) {
      //         event.preventDefault();
      //         event.stopPropagation();
      //       }
      //       $document.unbind('click', closeMenu);
      //       if (ev === 'mouseenter') {
      //         element.unbind('mouseenter', closeMenu);
      //       }
      //       element.next().removeClass('show');
      //       closeMenu = angular.noop;
      //       openElement = null;
      //     };
      //     $document.bind('click', closeMenu);
      //   }
      // });
      // if (ev === 'mouseenter') {
      //   element.next().bind('mouseenter', function() {
      //     $timeout.cancel(scope.timeout);
      //   });
      //   element.next().bind('mouseleave', function() {
      //     scope.timeout = $timeout(closeMenu, 150);
      //   });
      //   element.bind('mouseleave', function() {
      //     scope.timeout = $timeout(closeMenu, 150);
      //   });
      // }
    }
  };
}])
.directive('fdTab', ['fondantGroup', function(fondantGroup) {
  var events = {hover: 'mouseenter', click: 'click', hold: 'mouseenter'};
  return {
    scope: true,
    restrict: 'A',
    requrie: '^fd',
    controller: function($scope, $element, $attrs){
      $scope.groupName = $attrs.faTab || '$$' + $scope.$parent.$id + '.tab';
      var group = fondantGroup.get($scope.groupName)
        , type = $attrs.fdType || 'trigger'
        , bindEvent = events[$attrs.fdEvent] || events.click
        , index = group.add(type, $element[0]);
      if (type === 'trigger') {
        if ($element.hasClass('active')) {
          group.current(index);
        }
        $element.bind(bindEvent, function(event) {
          event.preventDefault();
          event.stopPropagation();
          if (group.current() !== index) {
            if (!$element.hasClass('disabled') && !$element.prop('disabled')) {
              group.rotate(index, 'trigger', 'active');
            }
          }
        });
      }
    }
  };
}])
.directive('fdMenu', ['fondantGroup', '$document', function(fondantGroup, $document) {
  return {
    scope: true,
    restrict: 'A',
    controller: function($scope, $element, $attrs){
      var bindEvent = $scope.groupName ? 'mouseenter' : 'click';
      $scope.groupName = $attrs.fdMenu || $scope.groupName ? $scope.groupName + '.sub' : '$$' + $scope.$parent.$id + '.menu';

      this.action = function(scope, element) {
        var group = fondantGroup.get(scope.groupName)
          , type = element.hasClass('menu') ? 'target' : 'trigger'
          , index = group.add(type, element[0]);

        if (type === 'trigger') {
          element.bind(bindEvent, function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (group.current() === null) {
              group.current(index);
              group.target(index).addClass('show');
              group.off(function() {
                $document.unbind('click', group.off());
                group.target(group.current()).removeClass('show');
                group.current(null);
                group.off(angular.noop);
              });

              $document.bind('click', group.off());
            }
          });
          element.bind('mouseenter', function() {
            angular.element(element.parent()[0].getElementsByClassName('show')).removeClass('show');
            if (angular.isNumber(group.current()) && !element.hasClass('disabled') && !element.prop('disabled')) {
              group.rotate(index);
            }
          });
        }
      };
    },
    link: function(scope, element, attrs, ctrl) {
      ctrl.action(scope, element);
    }
  };
}])

;