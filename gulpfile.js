var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");

var $ = gulpLoadPlugins();

gulp.task("copy", function() {
  gulp
    .src(["node_modules/apache-server-configs/dist/.htaccess", "./static/**/*"])
    .pipe(gulp.dest("./dist"))
    .pipe($.size({ title: "static" }));
});

gulp.task("html", function() {
  return gulp
    .src([
      "./src/templates/*.html",
      "./src/templates/sections/**/*.html",
      "!./src/templates/sections/**/partials/*.html"
    ])
    .pipe($.fileInclude())
    .pipe($.minifyHtml())
    .pipe(gulp.dest("./dist"))
    .pipe($.size({ title: "html" }));
});

gulp.task("validate", ["html"], function() {
  const validate = file => {
    require("w3cjs").validate({
      input: file.contents,
      callback: res => {
        let messages = res.messages;
        messages = messages.filter(message => message.type !== "info");
        if (messages && messages.length) {
          $.util.log($.util.colors.red(file.path));
          messages.forEach(message => {
            $.util.log($.util.colors.red(message.message));
            $.util.log(message.extract);
          });
        } else {
          $.util.log(file.path + $.util.colors.green(" [  OK  ]"));
        }
      }
    });
  };

  return gulp.src(["./dist/**/*.html"]).pipe(require("map-stream")(validate));
});

gulp.task("sitemap", ["html"], function() {
  return gulp
    .src("./dist/**/*.html")
    .pipe(
      $.sitemap({
        siteUrl: "http://sirlisko.com"
      })
    )
    .pipe(gulp.dest("./static"));
});

gulp.task("watch", ["default"], function() {
  gulp.watch("./src/**/*.html", ["html", "copy"]);
});

gulp.task("default", ["html", "copy"]);
