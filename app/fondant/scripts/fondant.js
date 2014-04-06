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
  Group.prototype.rotate = function(index, className, type) {
    className = className || 'show';
    type = type || 'target';

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

.directive('filefield', [function(){
  return {
    restrict: 'C',
    scope: {},
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

// .directive('fdDropdown', ['$document', '$timeout', function($document, $timeout) {
//   var openElement = null
//     , closeMenu = angular.noop
//     , handler = {};
//   handler.mouseenter = function(scope, element) {
//     element.bind('mouseenter', function(event) {
//       // scope.isOpened 
//       event.preventDefault();
//       event.stopPropagation();

//       if (scope.isOpened) {
//         $timeout.cancel(scope.timeout);
//       } else {
//         if (!element.hasClass('disabled') && !element.prop('disabled')) {
//           closeMenu = function() {
//             $document.unbind('click', closeMenu);
//             element.next().removeClass('show');
//             closeMenu = angular.noop;
//             scope.isOpened = false;
//           };

//           element.next().addClass('show');
//           scope.isOpened = true;
//           $document.bind('click', closeMenu);
//         }
//       }
//     });
//   };
//   return {
//     restrict: 'A',
//     scope: {
//       ev: '@fdDropdown',
//       group: '@'
//     },
//     link: function(scope, element) {
//       var ev = scope.ev || 'mouseenter';

//       scope.$watch('$location.path', function() { closeMenu(); });

//       handler.mouseenter(scope, element);

//       // element.bind(ev, function (event) {

//       //   scope.isOpened = (element === openElement);

//       //   event.preventDefault();
//       //   event.stopPropagation();

//       //   if (scope.isOpened) {
//       //     $timeout.cancel(scope.timeout);
//       //     return;
//       //   }
//       //   // if (!!openElement) {
//       //   //   closeMenu();
//       //   // }

//       //   if (!scope.isOpened && !element.hasClass('disabled') && !element.prop('disabled')) {
//       //     element.next().addClass('show');
//       //     openElement = element;
//       //     closeMenu = function (event) {
//       //       if (event) {
//       //         event.preventDefault();
//       //         event.stopPropagation();
//       //       }
//       //       $document.unbind('click', closeMenu);
//       //       if (ev === 'mouseenter') {
//       //         element.unbind('mouseenter', closeMenu);
//       //       }
//       //       element.next().removeClass('show');
//       //       closeMenu = angular.noop;
//       //       openElement = null;
//       //     };
//       //     $document.bind('click', closeMenu);
//       //   }
//       // });
//       // if (ev === 'mouseenter') {
//       //   element.next().bind('mouseenter', function() {
//       //     $timeout.cancel(scope.timeout);
//       //   });
//       //   element.next().bind('mouseleave', function() {
//       //     scope.timeout = $timeout(closeMenu, 150);
//       //   });
//       //   element.bind('mouseleave', function() {
//       //     scope.timeout = $timeout(closeMenu, 150);
//       //   });
//       // }
//     }
//   };
// }])
.directive('fdTab', ['fondantGroup', '$timeout', '$document', function(fondantGroup, $timeout, $document) {
  var types = ['toggle', 'content']
    , events = {hover: 'mouseenter', click: 'click', hold: 'mouseenter'};
  return {
    controller: function($scope, $element, $attrs){
      var group = fondantGroup.get($attrs.faTab)
        , type = $attrs.fdType || types[0]
        , bindEvent = events[$attrs.fdEvent] || events.hover
        , index = group.add(type, $element[0]);

      group.set('closeMenu', angular.noop);

      if (type === 'toggle') {
        $element.bind(bindEvent, function(event) {
          event.preventDefault();
          event.stopPropagation();
          if (group.current() !== index) {
            if (!$element.hasClass('disabled') && !$element.prop('disabled')) {
              group.set('closeMenu', function() {
                $document.unbind('click', group.get('closeMenu'));
                group.get('content', group.current()).removeClass('show');
                group.set('closeMenu', angular.noop);
              });

              if (group.current() !== null) {
                group.get('closeMenu')();
              }
              group.get('content', index).addClass('show');
              group.current(index);
              $document.bind('click', group.get('closeMenu'));
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