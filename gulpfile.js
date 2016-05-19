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
var nodeInspector = require('gulp-node-inspector');
var nodemon = require('gulp-nodemon');
var spawn = require('child_process').spawn,
  node;
var mocha = require('gulp-mocha');

var path = {
  ALL: ['./app.js'],
  WATCH: ['./app.js', './api/**/*.js', './api/**/*.yaml', './conf/*.json'],
  SWAGGER: 'api/swagger',
  TEST_DIR: './test/**/*.js',
  WEBPACK_BUILD: 'build',
  DEST: 'dist'
}

/**
 * Cleans the dist/ repository
 */
gulp.task('clean', function() {
  return del.sync([
    'dist/*'
  ]);
});

/**
 * Tests using every JS file contained in test/
 */
gulp.task('test', function() {
  return gulp.src(path.TEST_DIR)
    .pipe(mocha());
})

/**
 * Bundles files using webpack.
 */
gulp.task('webpack', function() {
  return gulp.src(path.ALL)
    .pipe(debug({
      title: 'webpack:'
    }))
    .pipe(webpack_stream(webpackConfig))
    .pipe(gulp.dest(path.WEBPACK_BUILD))
});

gulp.task('swagger', function() {
  return gulp.src(path.SWAGGER + "/swagger.yaml")
    .pipe(debug({
      title: 'swagger:'
    }))
    .pipe(gulp.dest(path.DEST + "/" + path.SWAGGER));
});

/**
 * Start dev server as debug using nodemon, can slow down the refresh a lot
 */
gulp.task('debug', ['compile', 'watch-server'], function() {
  nodemon({
    exec: 'node-inspector --web-port=8081 & node --debug-brk ',
    ext: 'js',
    ignore: ['.dist/*', 'node_modules/*'],
    script: 'dist/app',
    watch: path.WATCH,
    verbose: true
  }).on('start', ['']);
})

/**
 * Start the compile task for any changes in the server's
 */
gulp.task('watch-server', function() {
  return gulp.watch(path.WATCH, ['compile']);
})

/**
 * Start the dev server using nodemon
 */
gulp.task('dev', ['compile', 'watch-server'], function() {
  nodemon({
    exec: 'node',
    ext: 'js',
    ignore: ['node_modules/*'],
    script: 'dist/app',
    watch: 'dist',
    env: {
      'CONF': 'conf/dev-conf.json'
    },
    verbose: true
  }).on('start', ['']);
})

/**
 * Compiles the app. Uses webpack bundling and package files.
 */
gulp.task('compile', ['webpack', 'swagger'], function() {
  gulp.src('package.json')
    .pipe(debug({
      title: 'compile:'
    }))
    .pipe(gulp.dest(path.DEST));
  gulp.src('./conf/*.json')
    .pipe(debug({
      title: 'compile:'
    }))
    .pipe(gulp.dest(path.DEST + "/conf"));
  gulp.src('./api/**/*.js')
    .pipe(debug({
      title: 'compile:'
    }))
    .pipe(gulp.dest(path.DEST + "/api"));

});

gulp.task('default', ['compile']);
