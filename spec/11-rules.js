describe('Rules', function () {

  var psl = null;

  beforeEach(function (done) {
    psl = getExample('file');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('findRules', function (done) {
    psl = getExample('file');
    psl.initialize(function (err) {
      var results = psl.ruleLoader.findRules('test.zyx');
      assert.deepEqual(results, {
         '1': [], '2': [], '3': [ 'zyx' ]
      });
      done();
    });
  });

  it ('lookup', function (done) {
    psl = getExample('file');
    psl.initialize(function (err) {
      var result = psl.lookup('test.domain.zyx');
      assert.deepEqual(result, { domain : 'test', tld : 'domain.zyx' });
      result = psl.lookup('sub.test.domain.zyx');
      assert.deepEqual(result, { domain : 'test', tld : 'domain.zyx', subdomain : 'sub' });
      result = psl.lookup('sub.test.weather.zyx');
      assert.deepEqual(result, { domain : 'weather', tld : 'zyx', subdomain : 'sub.test' });
      done();
    });
  });

  it ('domain', function (done) {
    psl = getExample('file');
    psl.initialize(function (err) {
      assert.equal(psl.domain('test.domain.zyx'), 'test.domain.zyx');
      assert.equal(psl.domain('subdomain.test.domain.zyx'), 'test.domain.zyx');
      assert.equal(psl.domain('sub.test.weather.zyx'), 'weather.zyx');
      done();
    });
  });

  it ('tld', function (done) {
    psl = getExample('file');
    psl.initialize(function (err) {
      assert.equal(psl.tld('zyx'), 'zyx');
      assert.equal(psl.tld('domain.zyx'), 'domain.zyx');
      assert.equal(psl.tld('yxz'), 'yxz');
      assert.equal(psl.tld('test.yxz'), 'yxz');
      assert.equal(psl.tld('none.yxz'), null);
      done();
    });
  });

  it ('findRules (synchronous initialization)', function () {
    psl = getExample('file');
    psl.initializeSync();
    var results = psl.ruleLoader.findRules('test.zyx');
    assert.deepEqual(results, {
       '1': [], '2': [], '3': [ 'zyx' ]
    });
  });

  it ('lookup (synchronous initialization)', function () {
    psl = getExample('file');
    psl.initializeSync();
    var result = psl.lookup('test.domain.zyx');
    assert.deepEqual(result, { domain : 'test', tld : 'domain.zyx' });
    result = psl.lookup('sub.test.domain.zyx');
    assert.deepEqual(result, { domain : 'test', tld : 'domain.zyx', subdomain : 'sub' });
    result = psl.lookup('sub.test.weather.zyx');
    assert.deepEqual(result, { domain : 'weather', tld : 'zyx', subdomain : 'sub.test' });
  });

  it ('domain (synchronous initialization)', function () {
    psl = getExample('file');
    psl.initializeSync();
    assert.equal(psl.domain('test.domain.zyx'), 'test.domain.zyx');
    assert.equal(psl.domain('subdomain.test.domain.zyx'), 'test.domain.zyx');
    assert.equal(psl.domain('sub.test.weather.zyx'), 'weather.zyx');
  });

  it ('tld (synchronous initialization)', function () {
    psl = getExample('file');
    psl.initializeSync();
    assert.equal(psl.tld('zyx'), 'zyx');
    assert.equal(psl.tld('domain.zyx'), 'domain.zyx');
    assert.equal(psl.tld('yxz'), 'yxz');
    assert.equal(psl.tld('test.yxz'), 'yxz');
    assert.equal(psl.tld('none.yxz'), null);
  });

});
