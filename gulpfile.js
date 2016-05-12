var gulp = require('gulp');
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

gulp.task('package-resources', function() {
  return gulp.src(path.RESOURCES)
    .pipe(gulp.dest(path.RESOURCES_DEST));
})

gulp.task('package-config', function() {
  return gulp.src('./config/**')
    .pipe(gulp.dest(path.DEST + "/config"));
})

gulp.task('build', ['webpack', 'swaggerui', 'package-resources',
  'package-config'
]);

gulp.task('watch', function() {
  console.log('watching files for hot server.')
  gulp.watch(path.ALL, ['webpack']);
});

gulp.task('dev', ['webpack-dev-server', 'watch']);
