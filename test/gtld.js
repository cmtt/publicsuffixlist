var psl = require('../index.js')
  , assert = require('assert')
  , domain = null
  , result = null
  , validDomain = null
  , invalidDomain = null
  , validTLD = null
  , invalidTLD = null;

domain = psl.parse('division.zero');
assert.equal(domain,'division.zero');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'division');
assert.equal(psl.tld,'zero');

result = psl.lookup('your.tube');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'your');
assert.equal(result.tld,'tube');

validDomain = psl.validate('sun.today');
assert.equal(validDomain,true);

invalidDomain = psl.validate('rain.yesterday');
assert.equal(invalidDomain,false);

invalidDomain = psl.validate('clouds.tomorrow');
assert.equal(invalidDomain,false);

validTLD = psl.validateTLD('boo');
assert.equal(validTLD,true);

invalidTLD = psl.validateTLD('moo');
assert.equal(invalidTLD,false);