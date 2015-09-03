module.exports = function (gulp, config) {
  return function () {
    var jshint = require('gulp-jshint');
    return gulp.src(config.paths.jshint)
    .pipe(jshint(config.jshint))
    .pipe(jshint.reporter('default'));
  };
};
