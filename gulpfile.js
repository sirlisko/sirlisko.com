'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var isDev = false;

var onError = function (err) {
	$.util.log(err.plugin + ': ' + $.util.colors.red(err.message));
	$.util.beep();

	if (!isDev) {
		process.exit(1);
	}
};


var del = require('del');

gulp.task('clean', function () {
	return del(['dist'], function (err, deletedFiles) {
		$.util.log('Dist deleted!', deletedFiles.join(', '));
	});
});


gulp.task('copy', function () {
	return gulp.src([
		'node_modules/apache-server-configs/dist/.htaccess',
		'./public/**/*'
	]).pipe(gulp.dest('./dist'));
});


gulp.task('js:quality', function () {
	return gulp.src('./src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format()).on('error', onError);
});

var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('js', function () {
	return browserify('./src/javascripts/main.js')
		.bundle()
		.pipe(source('base.js'))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('html', function () {
	return gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude())
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'));
});


gulp.task('open', function () {
	require('opn')('./dist/index.html');
});


gulp.task('sass', function () {
	return gulp.src('./src/styles/*.scss')
		.pipe($.sass())
		.on('error', onError)
		.pipe($.autoprefixer({
			browsers: ['> 5%'],
			cascade: false
		}))
		.pipe($.combineMediaQueries())
		.pipe($.csso())
		.pipe(gulp.dest('./dist/css'));
});


gulp.task('validate', function () {
	var validate = function (file) {
		require('w3cjs').validate({
			input: file.contents,
			callback: function (res) {
				if (res.messages && res.messages.length) {
					$.util.log($.util.colors.red(file.path));
					$.util.log(res.messages);
				} else {
					$.util.log(file.path + $.util.colors.green(' [  OK  ]'));
				}
			}
		});
	};

	return gulp.src(['./dist/**/*.html'])
		.pipe(require('map-stream')(validate));
});


gulp.task('watch', function () {
	isDev = true;

	gulp.start('default');
	gulp.watch('./src/**/*.html', ['html']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['js', 'js:quality']);
});

gulp.task('default', ['html', 'sass', 'js:quality', 'js', 'copy']);
gulp.task('test', ['js:quality']);
