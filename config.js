var paths = {
  mocha : ['test/**/*.js'],
  jshint : ['*.js', 'lib/**/*.js', 'build/**/*.js', 'test/**/*.js']
};

var config = {
  mocha : {},
  jshint : {},
  paths : paths,
  verifyCertificates : false,
  source : 'org.publicsuffix',
  sources : {
    'org.publicsuffix' : {
      host : 'publicsuffix.org',
      path : '/list/effective_tld_names.dat?raw=1',
      file : 'effective_tld_names.dat'
    }
  }
};

module.exports = config;