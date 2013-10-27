var jsdom = require('jsdom').jsdom,
	ngPath;

// create global vars angular assumes are available
global.document = jsdom('<html><head></head><body></body></html>');
global.window = document.parentWindow;
global.navigator = {};

function compile() {
	// read angular source into memory
	var src = require('fs').readFileSync(ngPath, 'utf8');
	// replace implicit reference
	src = src.replace('angular.element(document)', 'window.angular.element(document)');
	// run it!
	eval(src);
}

// share the love
module.exports = function (path, overwrite) {
	if (global.window.angular && !overwrite) return global.window.angular;

	ngPath = path ? require('path').resolve(process.cwd(), path) : require.resolve('./lib/angular.js');
	compile();

	return global.window.angular;
}
