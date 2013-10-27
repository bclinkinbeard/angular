var jsdom = require('jsdom').jsdom;

// create global vars angular assumes are available
global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = {};

// read angular source into memory
var src = require('fs').readFileSync(require.resolve('./lib/angular.js'), 'utf8');
// replace implicit reference
src = src.replace('angular.element(document)', 'window.angular.element(document)');
// run it!
eval(src);

// share the love
module.exports = global.window.angular;
