var fs = require('fs');
var gulp = require('gulp');
var lz = require('gulp-lzstring');
var stripCode = require('gulp-strip-code');
var preprocess = require('gulp-preprocess');
var webmake = require('gulp-webmake');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');

gulp.task('default', ['mocha']);

gulp.task('mocha', function () {
  return gulp.src([
    'spec/*.js'
  ])
  .pipe(mocha());
});

gulp.task('watch-mocha', ['mocha'], function () {
  return gulp.watch([
    'spec/*.js',
    'lib/*.js',
    'index.js'
  ], ['mocha']);
});

gulp.task('compress-list', function () {
  return gulp.src([
    'effective_tld_names.dat'
  ])
  .pipe(stripCode({
    pattern : /^(\s*\n|\/\/(.*)\n)/gm
  }))
  .pipe(lz({ base64 : true }))
  .pipe(gulp.dest('.tmp'));
});

gulp.task('build-template', ['compress-list'], function () {
  var effective_tld_names = fs.readFileSync('./.tmp/effective_tld_names.dat').toString();
  return gulp.src('./browser-template.js')
  .pipe(replace('{{ effective_tld_names.dat }}', effective_tld_names))
  .pipe(concat('client.js'))
  .pipe(gulp.dest('.tmp'));
});

gulp.task('preprocess-psl', ['build-template'], function () {
  return gulp.src([
    'index.js',
    'lib/**/*'
  ], { base : '.'})
  .pipe(preprocess({
    context : {
      BROWSER : true
    }
  }))
  .pipe(gulp.dest('.tmp'));
});

gulp.task('build-client', ['preprocess-psl'], function () {
  return gulp.src('.tmp/client.js')
  .pipe(webmake())
  .pipe(gulp.dest('dist'));
});
