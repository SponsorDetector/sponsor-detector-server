var gulp = require('gulp');
var gulp_tar = require('gulp-tar');
var gulp_gz = require('gulp-gzip');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpack_stream = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var del = require('del');
var WebpackDevServer = require("webpack-dev-server");

var path = {
  ALL: ['./app.js'],
  SWAGGER : 'api/swagger/swagger.yaml',
  DEST: 'dist'
}

gulp.task('clean', function () {
  return del.sync([
    'dist/*'
  ]);
});

gulp.task('webpack', function() {
  return gulp.src(path.ALL)
    .pipe(webpack_stream(webpackConfig))
    .pipe(gulp.dest(path.DEST))
});


gulp.task('build', ['webpack']);

gulp.task('swagger', function() {
  return gulp.src(path.SWAGGER)
    .pipe(gulp.dest(path.DEST + "/" + path.SWAGGER));
});

gulp.task('watch', function() {
  console.log('watching files for hot server.')
  gulp.watch(path.ALL, ['webpack']);
});

gulp.task('package', ['clean', 'build', 'swagger'], function() {
  gulp.src('package.json')
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.DEST + '/**')
    .pipe(gulp_tar('package.tar'))
    .pipe(gulp_gz())
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', ['build']);
