var fs = require('fs'),
	document = require('jsdom').jsdom('<html><head></head><body></body></html>'),
	window = document.parentWindow;

module.exports = function (path) {

  var prevAngular, prevDocument, prevNavigator, prevWindow;

  // save global state before
  prevWindow = global.window;
  prevDocument = global.document;
  prevNavigator = global.navigator;
  prevAngular = global.angular;

  // this enables us to `require` angular's code
  global.window = window;
  global.document = document;
  global.navigator = window.navigator;

  // needed because angular is referenced as angular instead of window.angular
  global.angular = {
    $$csp: function() {
      return window.angular.$$csp.apply(window.angular, arguments);
    },
    element: function() {
      return window.angular.element.apply(window.angular, arguments);
    }
  };

  // require angular's code
  require(path);

  // restore global state
  global.window = prevWindow;
  global.document = prevDocument;
  global.navigator = prevNavigator;
  global.angular = prevAngular;

	return window.angular;
};
