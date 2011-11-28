var psl = require('../index.js');
var assert = require('assert');
var domain = null;

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

domain = psl.parse('sub.domain.co.uk');
assert.equal(domain,'domain.co.uk');
assert.equal(psl.subdomain,'sub');
assert.equal(psl.domain,'domain');
assert.equal(psl.tld,'co.uk');

domain = psl.parse('www.domain.de');
assert.equal(domain,'domain.de');
assert.equal(psl.subdomain,'www');
assert.equal(psl.domain,'domain');
assert.equal(psl.tld,'de');

domain = psl.parse('com');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('example.com');
assert.equal(domain,'example.com');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'com');

domain = psl.parse('www.example.com');
assert.equal(domain,'example.com');
assert.equal(psl.subdomain,'www');
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'com');

// leading dot

domain = psl.parse('.com');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('.example.com');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

// unlisted TLD

domain = psl.parse('example.example');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('www.example.example');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

// TLD with only one rule

domain = psl.parse('example.biz');
assert.equal(domain,'example.biz');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'biz');

// TLD with only 1 (wildcard) rule.
domain = psl.parse('cy');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('c.cy');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('b.c.cy');
assert.equal(domain,'b.c.cy');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'b');
assert.equal(psl.tld,'c.cy');

domain = psl.parse('a.b.c.cy');
assert.equal(domain,'b.c.cy');
assert.equal(psl.subdomain,'a');
assert.equal(psl.domain,'b');
assert.equal(psl.tld,'c.cy');

// More complex TLD and exception rules.

domain = psl.parse('jp');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('test.jp');
assert.equal(domain,'test.jp');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'test');
assert.equal(psl.tld,'jp');

domain = psl.parse('www.test.jp');
assert.equal(domain,'test.jp');
assert.equal(psl.subdomain,'www');
assert.equal(psl.domain,'test');
assert.equal(psl.tld,'jp');

domain = psl.parse('ac.jp');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('test.ac.jp');
assert.equal(domain,'test.ac.jp');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'test');
assert.equal(psl.tld,'ac.jp');

domain = psl.parse('www.test.ac.jp');
assert.equal(domain,'test.ac.jp');
assert.equal(psl.subdomain,'www');
assert.equal(psl.domain,'test');
assert.equal(psl.tld,'ac.jp');

domain = psl.parse('kyoto.jp');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('c.kyoto.jp');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('b.c.kyoto.jp');
assert.equal(domain,'b.c.kyoto.jp');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'b');
assert.equal(psl.tld,'c.kyoto.jp');

domain = psl.parse('pref.kyoto.jp');
assert.equal(domain,'pref.kyoto.jp');
assert.equal(psl.subdomain,'pref');
assert.equal(psl.domain,'kyoto');
assert.equal(psl.tld,'jp');

domain = psl.parse('www.pref.kyoto.jp');
assert.equal(domain,'pref.kyoto.jp');
assert.equal(psl.subdomain,'www.pref');
assert.equal(psl.domain,'kyoto');
assert.equal(psl.tld,'jp');

domain = psl.parse('city.kyoto.jp');
assert.equal(domain,'city.kyoto.jp');
assert.equal(psl.subdomain,'city');
assert.equal(psl.domain,'kyoto');
assert.equal(psl.tld,'jp');

// Punycode domains

domain = psl.parse('وزارة-الأتصالات.مصر'); // Egypt's Ministry of Communications and Information Technology
assert.equal(domain,'وزارة-الأتصالات.مصر')
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'وزارة-الأتصالات');
assert.equal(psl.tld,'مصر');

// CentralNic domains

domain = psl.parse('uk.com');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('example.uk.com');
assert.equal(domain,'example.uk.com');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'uk.com');

domain = psl.parse('an.example.uk.com');
assert.equal(domain,'example.uk.com');
assert.equal(psl.subdomain,'an');
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'uk.com');

domain = psl.parse('an.other.example.uk.com');
assert.equal(domain,'example.uk.com');
assert.equal(psl.subdomain,'an.other');
assert.equal(psl.domain,'example');
assert.equal(psl.tld,'uk.com');

domain = psl.parse('om');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('test.om');
assert.equal(domain,null);
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,null);
assert.equal(psl.tld,null);

domain = psl.parse('b.test.om');
assert.equal(domain,'b.test.om');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'b');
assert.equal(psl.tld,'test.om');

domain = psl.parse('a.b.test.om');
assert.equal(domain,'b.test.om');
assert.equal(psl.subdomain,'a');
assert.equal(psl.domain,'b');
assert.equal(psl.tld,'test.om');

domain = psl.parse('mediaphone.om');
assert.equal(domain,'mediaphone.om');
assert.equal(psl.subdomain,null);
assert.equal(psl.domain,'mediaphone');
assert.equal(psl.tld,'om');

validDomain = psl.validate('domain.de');
assert.equal(validDomain,true);

invalidDomain = psl.validate('domain.yz');
assert.equal(invalidDomain,false);