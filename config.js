var config = {
  mocha : {},
  jshint : {},
  verifyCertificates : true,
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
