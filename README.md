angular-node
============

AngularJS compiled with jsdom and provided as a CommonJS module. Intended for testing AngularJS code without depending on a browser.

## How

To use the bundled version of AngularJS (v1.2.0-rc.3 at the time of this writing), simply require the library and call its returned function with no arguments:

`
var angular = require('angular-node')();
`

To use a specific version of AngularJS, pass the relative path into the function:

`
var angular = require('angular-node')('path/to/angular/source.js');
`

Note that in addition to populating the variable to which you assign the return value, `global.window.angular` will also be populated. Subsequent calls will return the cached version unless you pass `true` as the second argument to the function. Doing so will overwrite `global.window.angular` with the newly created instance.


## Why

Having a version of AngularJS that works outside the browser could be convenient for many reasons, but the primary motivation was around testability and modularity of AngularJS related projects. For developers utilizing the CommonJS standard and Browserify to build AngularJS projects and ecosystems, the hope is that this module will greatly simplify that workflow.

As [egghead.io](http://egghead.io) has shown, testing [simple views](https://egghead.io/lessons/angularjs-unit-testing-hello-world) and [directives](https://egghead.io/lessons/angularjs-unit-testing-a-directive) is a great way to ensure the pieces of your app are working as intended. Unfortunately, testing this way usually requires running your code in a real browser via something like Karma, because AngularJS assumes `window` and `document` are both available. Additionally, AngularJS (via `angular-mocks.js`) only exposes the `inject` method shown in the [egghead.io](http://egghead.io) videos if `window.jasmine` is defined. 

This module allows you to test AngularJS views and directives using any testing framework and runner you like, from Mocha to Nodeunit to tape.

This module also aims to make it much easier to create AngularJS directives, modules, and other components that can be independently published to and versioned in npm and/or their own repositories.

## Examples

The `inject` method referenced above is really just a shortcut to `$injector.invoke`, but `$injector` is only available from within AngularJS. Fortunately, there are two ways to get a reference to Angular's injector from outside of AngularJS code.

```
// this will return a fresh instance of injector each time it's called
// if your code is not running in a browser you must use this method
var injector = angular.injector(['ng']);

// provided only as an FYI, the following method WILL NOT WORK with angular-node
// this will return the injector singleton for the application in which <element> is defined.
// for code that runs in a browser you could just use document if ng-app is defined on <html>
// otherwise you can use any element that is a descendent of the tag your app is defined/bootstrapped on
var injector = angular.element(<element>).injector();
```

### Testing view compilation

```
var angular = require('angular-node')();
var injector = angular.injector(['ng']);
var num;

var fn = function ($rootScope, $compile) {
	var el = angular.element('<div>{{ 2 + 2 }}</div>');
	el = $compile(el)($rootScope);
	$rootScope.$digest();
	num = el.html();
}

injector.invoke(fn);

// +num === 4
```

### Testing event handling

```
var angular = require('angular-node')();
var injector = angular.injector(['ng']);
var answer;

var fn = function ($rootScope) {
	$rootScope.$on('foo', function (e, val) {
		answer = val;
	});
	$rootScope.$broadcast('foo', 'bar')
}

injector.invoke(fn);

// answer === 'bar'
```