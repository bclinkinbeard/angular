var test = require('tape'),
	angular = require('../'),
	inject = angular.injector(['ng']).invoke;

test('init', function (t) {
	t.true(angular, 'Angular instance is defined');
	t.end();
});

test('injector', function (t) {
	var el;

	test('should compile a binding', function (t) {

		inject(function ($rootScope, $compile) {
			el = angular.element('<div>{{ 2 + 2 }}</div>');
			el = $compile(el)($rootScope);
			$rootScope.$digest();
		})

		t.equal(+el.html(), 4, 'simple binding compiled');

		t.end();
	});

	t.end();

});
