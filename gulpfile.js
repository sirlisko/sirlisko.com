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


var bower = require('main-bower-files');

gulp.task('bower', function () {
	return gulp.src(bower())
		.pipe(gulp.dest('./dist/js/ext/'));
});


var del = require('del');

gulp.task('clean', function () {
	return del(['dist'], function (err, deletedFiles) {
		console.log('Dist deleted!', deletedFiles.join(', '));
	});
});


gulp.task('copy', function () {
	return gulp.src([
		/*'node_modules/apache-server-configs/dist/.htaccess',*/
		'./public/**/*'
	]).pipe(gulp.dest('./dist'));
});


gulp.task('js', function () {
	return gulp.src('./src/**/*.js')
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail')).on('error', onError)
		.pipe($.concat('base.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('dist/js'));
});


gulp.task('html', function () {
	return gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude())
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'));
});


gulp.task('open', function () {
	return gulp.src('./dist/index.html')
		.pipe($.open('<%file.path%>'));
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


gulp.task('deploy', function () {
	return gulp.src('./dist/**', {dot: true})
		.pipe($.rsync({
			root: 'dist',
			hostname: 'sirlisko@web210.webfaction.com',
			destination: '/home/sirlisko/webapps/sirlisko',
			progress: true
		}));
});

gulp.task('watch', function () {
	isDev = true;

	gulp.start('default');
	gulp.watch('./src/**/*.html', ['html']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['js']);
});

gulp.task('default', ['html', 'sass', 'js', 'bower', 'copy']);
