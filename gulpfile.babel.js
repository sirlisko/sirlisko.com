import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'

const $ = gulpLoadPlugins()

gulp.task('copy', () =>
  gulp.src([
    'node_modules/apache-server-configs/dist/.htaccess',
    './public/**/*'
  ])
  .pipe(gulp.dest('./dist'))
  .pipe($.size({
    title: 'public'
  }))
)


import browserify from 'browserify'
import source from 'vinyl-source-stream'
const scopes = [
  { input: 'main.js', output: 'base.js' },
  { input: 'modules/beacon.js', output: 'trak.js' }
]
gulp.task('js', () =>
  scopes.forEach(({input, output}) => browserify(`./src/javascripts/${input}`)
    .bundle()
    .pipe(source(output))
    .pipe(gulp.dest('dist/js'))
    .pipe($.size({
      title: `js - ${output}`
    }))
  )
)

gulp.task('js-watch', ['js', 'js:quality'], browserSync.reload)

gulp.task('html', () =>
  gulp.src([
    './src/templates/*.html',
    './src/templates/sections/**/*.html',
    '!./src/templates/sections/**/partials/*.html'
  ])
  .pipe($.fileInclude())
  .pipe($.minifyHtml())
  .pipe(gulp.dest('./dist'))
  .pipe($.size({
    title: 'html'
  }))
)

gulp.task('html-watch', ['html'], browserSync.reload)

gulp.task('validate', ['html'], () => {
  const validate = file => {
    require('w3cjs').validate({
      input: file.contents,
      callback: res => {
        let messages = res.messages
        messages = messages.filter(message => message.type !== 'info')
        if (messages && messages.length) {
          $.util.log($.util.colors.red(file.path))
          messages.forEach(message => {
            $.util.log($.util.colors.red(message.message))
            $.util.log(message.extract)
          })
        } else {
          $.util.log(file.path + $.util.colors.green(' [  OK  ]'))
        }
      }
    })
  }

  return gulp.src(['./dist/**/*.html'])
    .pipe(require('map-stream')(validate))
})

gulp.task('sitemap', ['html'], () =>
  gulp.src('./dist/**/*.html')
  .pipe($.sitemap({
    siteUrl: 'http://sirlisko.com'
  }))
  .pipe(gulp.dest('./public'))
)

gulp.task('watch', ['default'], () => {
<<<<<<< HEAD
  browserSync({
    notify: false,
    server: './dist'
  })

  gulp.watch('./src/**/*.html', ['html-watch'])
  gulp.watch('./src/**/*.js', ['js-watch'])
=======
  gulp.watch('./src/**/*.html', ['html'])
  gulp.watch('./src/**/*.js', ['js'])
>>>>>>> a329dbb... Moved eslint from gulp
})

gulp.task('default', ['html', 'js', 'copy'])
