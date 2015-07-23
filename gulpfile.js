'use strict';

var gulp = require('gulp');
var merge = require('merge-stream');
var connect = require('gulp-connect');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var htmlmin = require('gulp-htmlmin');
var _ = require('lodash');
var protractor = require('gulp-protractor').protractor;
var template = require('gulp-template');
var connectHistory = require('connect-history-api-fallback');

var debug = process.env.DEBUG || false;

var config = require('./config.json');

var paths = {
  templates: 'src/templates/**/*.html',
  images: 'src/img/**/*',
  index: 'src/index.html',
  build: 'build/**/*'
};

var htmlminOpts = {
  collapseWhitespace: true,
  removeComments: true
};

// error handling, simplified version (without level) from
// http://www.artandlogic.com/blog/2014/05/error-handling-in-gulp/
function handleError(error) {
  gutil.log(error);
  process.exit(1);
}

// bundle html templates via angular's templateCache
gulp.task('templates', function() {
  var templateCache = require('gulp-angular-templatecache');

  return gulp.src(paths.templates, {base: 'src'})
    .pipe(debug ? gutil.noop() : htmlmin(htmlminOpts))
    .pipe(templateCache({
      moduleSystem: 'Browserify',
      standalone: true,
      base: function(file) {
        return file.relative;
      }
    }))
    .pipe(gulp.dest('tmp'));
});

// copy static files
gulp.task('static', function() {
  var index = gulp.src(paths.index, {base: 'src'})
    .pipe(template({config: config}))
    .pipe(debug ? gutil.noop() : htmlmin(htmlminOpts))
    .pipe(gulp.dest('build'));

  var images = gulp.src(paths.images, {base: 'src'})
    .pipe(gulp.dest('build'));

  var bootstrap = gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest('build/assets/bootstrap/fonts'));

  var fontawesome = gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest('build/assets/fontawesome/fonts'));

  var leaflet = gulp.src('bower_components/leaflet/dist/images/*')
    .pipe(gulp.dest('build/assets/leaflet/images'));

  var mathjaxBase = 'bower_components/MathJax/';
  var mathjaxSrc = _.map([
    'MathJax.js',
    'config/TeX-AMS_HTML-full.js',
    'config/Safe.js',
    'extensions/Safe.js',
    'fonts/HTML-CSS/**/woff/*.woff',
    'jax/element/**',
    'jax/output/HTML-CSS/**'
  ], function(path) {
    return mathjaxBase + path;
  });
  var mathjax = gulp.src(mathjaxSrc, {base: mathjaxBase})
    .pipe(gulp.dest('build/assets/mathjax'));

  var pdfjs = gulp.src('bower_components/pdfjs-dist/build/pdf.worker.js')
    .pipe(debug ? gutil.noop() : streamify(uglify()))
    .pipe(gulp.dest('build/assets/pdfjs'));

  var roboto = gulp.src('bower_components/roboto-fontface/fonts/*')
    .pipe(gulp.dest('build/assets/roboto/fonts'));

  return merge(index, images, bootstrap, fontawesome, leaflet,
               mathjax, pdfjs, roboto);
});

// serve without watchin (no livereload)
gulp.task('serve-nowatch', function() {
  connect.server({
    root: 'build',
    middleware: function(connect, opt) {
      // default to index.html
      return [connectHistory()];
    }
  });
});

var aggregate = require('gulp-aggregate');
var watch = require('gulp-watch');

// serve with livereload
gulp.task('serve', ['serve:connect', 'serve:watch']);

// serve built files
gulp.task('serve:connect', function() {
  connect.server({
    root: 'build',
    livereload: true,
    middleware: function(connect, opt) {
      // default to index.html
      return [connectHistory()];
    }
  });
});

// watch built files and initiate live reload
gulp.task('serve:watch', function() {
  watch(paths.build)
    .pipe(aggregate({debounce: 500}, function(agg) {
      console.log('reload!');
      return agg.pipe(connect.reload());
    }));
});

// test
gulp.task('test-protractor', ['serve-nowatch'], function() {
  gulp.src(['./test/protractor/*.js'])
  .pipe(protractor({
    configFile: 'test/protractor/protractor.js'
  }))
  .on('error', handleError)
  .on('end', function(e) {
    connect.serverClose();
  });
});
