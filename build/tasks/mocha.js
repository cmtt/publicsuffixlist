module.exports = function(gulp, paths, config, mocha, istanbul){
  gulp.task('pre-test', function () {
    return gulp.src(paths.istanbul)
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
  });

  gulp.task('mocha', gulp.series('pre-test', function () {
    return gulp.src(paths.mocha)
    .pipe(mocha(config.mocha))
    .pipe(istanbul.writeReports());
  }));
};
