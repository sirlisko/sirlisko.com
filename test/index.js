var browserify = require('browserify');
var proxyquire = require('proxyquireify');
var run = require('tape-run');

browserify([__dirname + '/beaconTest.js', __dirname + '/switchTitleTest.js'])
	.bundle()
	.pipe(run())
	.pipe(process.stdout);

//in order to mock internal dependecy
browserify(__dirname + '/ghostTest.js')
	.plugin(proxyquire.plugin)
	.bundle()
	.pipe(run())
	.pipe(process.stdout);
