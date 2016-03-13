module.exports = function (gulp, config, paths, jshint) {
  gulp.task('jshint',function () {
    return gulp.src(paths.jshint)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('default'));
  });
};
