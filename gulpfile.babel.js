'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

let isDev = false;

const onError = err => {
	$.util.log(err.plugin + ': ' + $.util.colors.red(err.message));
	$.util.beep();

	if (isDev) {
		this.emit('end');
	} else {
		process.exit(1);
	}
};


gulp.task('clean', () => {
	return require('del')(['dist'], (err, deletedFiles) => {
		$.util.log('Dist deleted!', deletedFiles.join(', '));
	});
});


gulp.task('copy', () => {
	return gulp.src([
		'node_modules/apache-server-configs/dist/.htaccess',
		'./public/**/*'
	]).pipe(gulp.dest('./dist'));
});


gulp.task('js:quality', () => {
	return gulp.src('./src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format()).on('error', onError);
});

import browserify from 'browserify';
import source from 'vinyl-source-stream';

gulp.task('js', () => {
	return browserify('./src/javascripts/main.js')
		.bundle()
		.pipe(source('base.js'))
		.pipe(gulp.dest('dist/js'));
});


gulp.task('html', () => {
	return gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude())
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'));
});


gulp.task('open', () => {
	require('opn')('./dist/index.html');
});


gulp.task('sass', () => {
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


gulp.task('validate', () => {
	const validate = file => {
		require('w3cjs').validate({
			input: file.contents,
			callback: res => {
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


gulp.task('watch', () => {
	isDev = true;

	gulp.start('default');
	gulp.watch('./src/**/*.html', ['html']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['js', 'js:quality']);
});

gulp.task('default', ['html', 'sass', 'js:quality', 'js', 'copy']);
gulp.task('test', ['js:quality']);
