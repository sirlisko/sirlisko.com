var browserify = require('browserify')
var proxyquire = require('proxyquireify')
var run = require('tape-run')
var path = require('path')

browserify([path.join(__dirname, '/beaconTest.js'), path.join(__dirname, '/switchTitleTest.js')])
	.bundle()
	.pipe(run())
	.pipe(process.stdout)

// in order to mock internal dependecy
browserify(path.join(__dirname, '/ghostTest.js'))
	.plugin(proxyquire.plugin)
	.bundle()
	.pipe(run())
	.pipe(process.stdout)
