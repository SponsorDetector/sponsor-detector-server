var gulp = require('gulp');
var gulp_tar = require('gulp-tar');
var gulp_gz = require('gulp-gzip');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpack_stream = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var WebpackDevServer = require("webpack-dev-server");

var path = {
  ALL: ['./app.js', "api/**/*.js"],
  RESOURCES: ['./api/swagger/swagger.yaml'],
  SWAGGERUI: ['node_modules/swagger-ui/dist/**', './api/swagger/index.html'],
  RESOURCES_DEST: 'dist/resources',
  DEST: 'dist'
}


gulp.task('webpack', function() {
  return gulp.src(path.ALL)
    .pipe(webpack_stream(webpackConfig))
    .pipe(gulp.dest(path.DEST))
});

gulp.task("webpack-dev-server", ['build'], function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]",
      "http://localhost:10010/webpack-dev-server/index.html");
  });
});


gulp.task('swaggerui', function() {
  return gulp.src(path.SWAGGERUI)
    .pipe(gulp.dest(path.DEST + "/swaggerui"));
});

gulp.task('prepare-resources', function() {
  return gulp.src(path.RESOURCES)
    .pipe(gulp.dest(path.RESOURCES_DEST));
})


gulp.task('build', ['webpack', 'swaggerui', 'prepare-resources']);

gulp.task('watch', function() {
  console.log('watching files for hot server.')
  gulp.watch(path.ALL, ['webpack']);
});

gulp.task('dev', ['webpack-dev-server', 'watch']);

gulp.task('package', ['build'], function() {
  gulp.src(path.DEST + '/**')
    .pipe(gulp_tar('package.tar'))
    .pipe(gulp_gz())
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', ['build']);
