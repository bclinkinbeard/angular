var request = require('request'),
	fs = require('fs'),
	path = require('path'),
	exec = require('child_process').exec,
	version = require('../package.json').version;

var urlStub = 'http://code.angularjs.org/',
	files = ['/angular.min.js', '/angular.min.js.map'];

function getFile (index) {
	var file = files[index],
		writer = fs.createWriteStream('lib' + file);

	writer.on('finish', function () {
		console.log(file.substr(1), 'fetched and written');
		if (index < files.length - 1) {
			getFile(index + 1);
		} else {
			testAndTag();
		}
	});

	request(urlStub + version + file).pipe(writer);
};

function testAndTag () {
	console.log('running tests');
	exec('npm test', function (error, stdout, stderr) {
		if (error !== null) {
			console.log('test error: ' + error);
		} else {
			var fileList = files.map(function (file) {
				return path.resolve('lib' + file)
			})
			exec('git commit ' + fileList.join(' ') + ' -m "Angular v' + version + ' source files"');
			exec('git reset --hard');
			exec('npm version ' + version + ' -m "Angular v%s with Browserify support"');
		}
	});
}

getFile(0);
