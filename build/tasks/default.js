module.exports = function (gulp) {
  gulp.task('default', gulp.series('jshint', 'mocha'));
};
