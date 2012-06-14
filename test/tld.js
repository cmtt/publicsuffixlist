var psl = require('../index.js')
  , assert = require('assert')
  , domain = null
  , result = null
  , validDomain = null
  , invalidDomain = null
  , validTLD = null
  , invalidTLD = null;

// psl.parse

domain = psl.parse(null);
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('sub.domain.de');
assert.equal(domain,'domain.de');
assert.equal(psl.subdomain,'sub');
assert.equal(psl.domain,'domain');
assert.equal(psl.tld,'de');

// psl.lookup

result = psl.lookup('sub.domain.co.uk');
assert.equal(result.subdomain,'sub');
assert.equal(result.domain,'domain');
assert.equal(result.tld,'co.uk');

result = psl.lookup('www.domain.de');
assert.equal(result.subdomain,'www');
assert.equal(result.domain,'domain');
assert.equal(result.tld,'de');

result = psl.lookup('com');
assert.equal(result,null);

result = psl.lookup('example.com');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'example');
assert.equal(result.tld,'com');

result = psl.lookup('www.example.com');
assert.equal(result.subdomain,'www');
assert.equal(result.domain,'example');
assert.equal(result.tld,'com');

// leading dot

result = psl.lookup('.com');
assert.equal(null);

result = psl.lookup('.example.com');
assert.equal(result,null);

// unlisted TLD

result = psl.lookup('example.example');
assert.equal(result,null);

result = psl.lookup('www.example.example');
assert.equal(result,null);

// TLD with only one rule

result = psl.lookup('example.biz');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'example');
assert.equal(result.tld,'biz');

// TLD with only 1 (wildcard) rule.
result = psl.lookup('cy');
assert.equal(result,null);

result = psl.lookup('c.cy');
assert.equal(result,null);

result = psl.lookup('b.c.cy');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'b');
assert.equal(result.tld,'c.cy');

result = psl.lookup('a.b.c.cy');
assert.equal(result.subdomain,'a');
assert.equal(result.domain,'b');
assert.equal(result.tld,'c.cy');

// More complex TLD and exception rules.

result = psl.lookup('jp');
assert.equal(result,null);

result = psl.lookup('test.jp');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'test');
assert.equal(result.tld,'jp');

result = psl.lookup('www.test.jp');
assert.equal(result.subdomain,'www');
assert.equal(result.domain,'test');
assert.equal(result.tld,'jp');

result = psl.lookup('ac.jp');
assert.equal(result,null);

result = psl.lookup('test.ac.jp');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'test');
assert.equal(result.tld,'ac.jp');

result = psl.lookup('www.test.ac.jp');
assert.equal(result.subdomain,'www');
assert.equal(result.domain,'test');
assert.equal(result.tld,'ac.jp');

result = psl.lookup('kyoto.jp');
assert.equal(result,null);

result = psl.lookup('c.kyoto.jp');
assert.equal(result,null);

result = psl.lookup('b.c.kyoto.jp');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'b');
assert.equal(result.tld,'c.kyoto.jp');

result = psl.lookup('pref.kyoto.jp');
assert.equal(result.subdomain,'pref');
assert.equal(result.domain,'kyoto');
assert.equal(result.tld,'jp');

result = psl.lookup('www.pref.kyoto.jp');
assert.equal(result.subdomain,'www.pref');
assert.equal(result.domain,'kyoto');
assert.equal(result.tld,'jp');

result = psl.lookup('city.kyoto.jp');
assert.equal(result.subdomain,'city');
assert.equal(result.domain,'kyoto');
assert.equal(result.tld,'jp');

// Punycode domains

result = psl.lookup('وزارة-الأتصالات.مصر'); // Egypt's Ministry of Communications and Information Technology
assert.equal(result.subdomain,null);
assert.equal(result.domain,'وزارة-الأتصالات');
assert.equal(result.tld,'مصر');

// CentralNic domains

result = psl.lookup('uk.com');
assert.equal(result,null);

result = psl.lookup('example.uk.com');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'example');
assert.equal(result.tld,'uk.com');

result = psl.lookup('an.example.uk.com');
assert.equal(result.subdomain,'an');
assert.equal(result.domain,'example');
assert.equal(result.tld,'uk.com');

result = psl.lookup('an.other.example.uk.com');
assert.equal(result.subdomain,'an.other');
assert.equal(result.domain,'example');
assert.equal(result.tld,'uk.com');

result = psl.lookup('om');
assert.equal(result,null);

result = psl.lookup('test.om');
assert.equal(result,null);

result = psl.lookup('b.test.om');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'b');
assert.equal(result.tld,'test.om');

result = psl.lookup('a.b.test.om');
assert.equal(result.subdomain,'a');
assert.equal(result.domain,'b');
assert.equal(result.tld,'test.om');

result = psl.lookup('mediaphone.om');
assert.equal(result.subdomain,null);
assert.equal(result.domain,'mediaphone');
assert.equal(result.tld,'om');

// domain name validation

validDomain = psl.validate('domain.de');
assert.equal(validDomain,true);

invalidDomain = psl.validate('domain.yz');
assert.equal(invalidDomain,false);

// TLD validation

validTLD = psl.validateTLD('io');
assert.equal(validTLD,true);

validTLD = psl.validateTLD('.io');
assert.equal(validTLD,true);

invalidTLD = psl.validateTLD('yz');
assert.equal(invalidTLD,false);

// exception rule

invalidTLD = psl.validateTLD('metro.tokyo.jp');
assert.equal(invalidTLD,false);

// wildcard
invalidTLD = psl.validateTLD('akita.jp');
assert.equal(invalidTLD,false);

validTLD = psl.validateTLD('city.akita.jp');
assert.equal(validTLD,true);


// invalid input

result = psl.lookup(0);
assert.equal(result,null);

result = psl.lookup(Infinity);
assert.equal(result,null);

result = psl.lookup({});
assert.equal(result,null);

result = psl.parse(0);
assert.equal(result,null);

result = psl.parse(Infinity);
assert.equal(result,null);

result = psl.parse({});
assert.equal(result,null);

invalidDomain = psl.validate(0);
assert.equal(invalidDomain,false);

invalidDomain = psl.validate(Infinity);
assert.equal(invalidDomain,false);

invalidDomain = psl.validate({});
assert.equal(invalidDomain,false);

invalidTLD = psl.validateTLD(0);
assert.equal(invalidTLD,false);

invalidTLD = psl.validateTLD(Infinity);
assert.equal(invalidTLD,false);

invalidTLD = psl.validateTLD({});
assert.equal(invalidTLD,false);
