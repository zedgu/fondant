'use strict';

describe('Directive: fdCode', function () {

  // load the directive's module
  beforeEach(module('fondantApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fd-code></fd-code>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fdCode directive');
  }));
});
