module.exports = function () {
  var paths = {
    mocha : ['test/**/*.js'],
    jshint : ['*.js', 'lib/**/*.js', 'build/**/*.js', 'test/**/*.js'],
    istanbul : [
      'index.js',
      'lib/**/*.js'
    ]
  };
  return paths;
};