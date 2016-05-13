var gulp = require('gulp');
var gulp_tar = require('gulp-tar');
var gulp_gz = require('gulp-gzip');
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");
var webpack_stream = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var del = require('del');
var debug = require('gulp-debug');
var WebpackDevServer = require("webpack-dev-server");
var gulpsync = require('gulp-sync')(gulp);
var spawn = require('child_process').spawn,
    node;

var path = {
  ALL: ['./app.js'],
  WATCH: ['./app.js', './api/**/*.js', './api/**/*.yaml'],
  SWAGGER : 'api/swagger',
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
  return gulp.src(path.SWAGGER + "/swagger.yaml")
    .pipe(gulp.dest(path.DEST + "/" + path.SWAGGER));
});

gulp.task('debug', function() {
    if (node) {
      node.kill()
    }
    node = spawn('node', ['app.js'], {stdio: 'inherit'})
    node.on('close', function (code) {
      if (code === 8) {
        gulp.log('Error detected, waiting for changes...');
      }
    });
});

gulp.task('dev', gulpsync.sync(['debug']), function() {
  gulp.watch(path.WATCH, function() {
    gulp.run('debug');
  });
})

gulp.task('package', ['clean', 'build', 'swagger'], function() {
  gulp.src('package.json')
  	.pipe(debug({title: 'package:'}))
    .pipe(gulp.dest(path.DEST));
  gulp.src(path.DEST + '/**')
    .pipe(debug({title: 'package:'}))
    .pipe(gulp_tar('package.tar'))
    .pipe(gulp_gz())
    .pipe(gulp.dest(path.DEST));
});

gulp.task('default', ['build']);
