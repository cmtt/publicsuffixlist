describe('old tests', function () {
  var psl = null;

  var domain = null;
  var result = null;
  var validDomain = null;
  var invalidDomain = null;
  var validTLD = null;
  var invalidTLD = null;

  beforeEach(function (done) {
    psl = getExample('psl');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('invalid input', function () {

    result = psl.lookup(0);
    assert.equal(result,null);

    result = psl.lookup(Infinity);
    assert.equal(result,null);

    result = psl.lookup({});
    assert.equal(result,null);

    result = psl.domain(0);
    assert.equal(result,null);

    result = psl.domain(Infinity);
    assert.equal(result,null);

    result = psl.domain({});
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

  });

  it('lookup', function () {

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
  });

  it('leading dot', function () {
    result = psl.lookup('.com');
    assert.equal(result, null);

    result = psl.lookup('.example.com');
    assert.equal(result,null);
  });

  it ('unlisted TLD', function () {
    result = psl.lookup('example.example');
    assert.equal(result,null);

    result = psl.lookup('www.example.example');
    assert.equal(result,null);
  });

  it ('TLD with only one rule', function () {
    result = psl.lookup('example.biz');
    assert.equal(result.subdomain,null);
    assert.equal(result.domain,'example');
    assert.equal(result.tld,'biz');
  });

  it('TLD with only 1 (wildcard) rule.', function () {
    result = psl.lookup('er');
    assert.equal(result,null);

    result = psl.lookup('c.er');
    assert.equal(result,null);

    result = psl.lookup('b.c.er');
    assert.equal(result.subdomain,null);
    assert.equal(result.domain,'b');
    assert.equal(result.tld,'c.er');

    result = psl.lookup('a.b.c.er');
    assert.equal(result.subdomain,'a');
    assert.equal(result.domain,'b');
    assert.equal(result.tld,'c.er');
  });

  it('More complex TLD and exception rules.', function () {

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
    // assert.equal(result,null);
    assert.equal(result.domain,'c');
    assert.equal(result.tld,'kyoto.jp');

    result = psl.lookup('b.c.kyoto.jp');
    assert.equal(result.subdomain,'b');
    assert.equal(result.domain,'c');
    assert.equal(result.tld,'kyoto.jp');

    result = psl.lookup('pref.kyoto.jp');
    assert.equal(result.domain,'pref');
    assert.equal(result.tld,'kyoto.jp');

    result = psl.lookup('www.pref.kyoto.jp');
    assert.equal(result.subdomain,'www');
    assert.equal(result.domain,'pref');
    assert.equal(result.tld,'kyoto.jp');

    result = psl.lookup('city.kyoto.jp');
    assert.equal(result.domain,'city');
    assert.equal(result.tld,'kyoto.jp');
  });

  it ('Punycode domains', function () {
    /**
     * Punycode is a encoding standard for unicode domain names. This
     * encoding syntax between unicode and ASCII is described in RFC 3492.
     *
     * http://www.ietf.org/rfc/rfc3492.txt
     */
    result = psl.lookup('وزارة-الأتصالات.مصر'); // Egypt's Ministry of Communications and Information Technology
    assert.equal(result.subdomain,null);
    assert.equal(result.domain,'وزارة-الأتصالات');
    assert.equal(result.tld,'مصر');
  });

  it ('CentralNic domains', function () {
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

    result = psl.lookup('auto.pl');
    assert.equal(result,null);

    result = psl.lookup('b.auto.pl');
    assert.equal(result.subdomain,null);
    assert.equal(result.domain,'b');
    assert.equal(result.tld,'auto.pl');

    result = psl.lookup('a.b.auto.pl');
    assert.equal(result.subdomain,'a');
    assert.equal(result.domain,'b');
    assert.equal(result.tld,'auto.pl');
  });

  it ('domain name validation', function () {
    // // domain name validation

    validDomain = psl.validate('domain.de');
    assert.equal(validDomain,true);

    invalidDomain = psl.validate('domain.yz');
    assert.equal(invalidDomain,false);
  });

  it ('exception rules', function () {
    invalidTLD = psl.validate('city.yokohama.jp');
    assert.equal(invalidTLD,false);

    // wildcard
    invalidTLD = psl.validate('me.uk');
    assert.equal(invalidTLD,false);

    validTLD = psl.validate('worse-than.tv');
    assert.equal(validTLD,false);
  });

  it ('TLD validation', function () {

    validTLD = psl.validateTLD('io');
    assert.equal(validTLD,true);

    validTLD = psl.validateTLD('.io');
    assert.equal(validTLD,true);

    invalidTLD = psl.validateTLD('yz');
    assert.equal(invalidTLD,false);
  });
});

