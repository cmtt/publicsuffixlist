module.exports = function(gulp, config){
  return function () {
    var mocha = require('gulp-mocha');
    return gulp.src(config.paths.mocha)
    .pipe(mocha(config.mocha));
  };
};
