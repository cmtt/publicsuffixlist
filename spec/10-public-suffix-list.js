describe('PublicSuffixList', function () {
  var PublicSuffixList = getPublicSuffixList();
  var fs = require('fs');
  var is = require(basePath('lib','is'));

  it ('is present', function () {
    assert.ok(is.Function(PublicSuffixList));
  });


  it ('initializes asynchronously with a rule file', function (done) {
    var psl = getExample('file');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes asynchronously without any options', function (done) {
    var psl = new PublicSuffixList();
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes asynchronously with a buffer', function (done) {
    var psl = getExample('buffer');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes asynchronously with lines', function (done) {
    var psl = getExample('lines');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes synchronously with a rule file', function () {
    var psl = getExample('file');
    psl.initializeSync();
  });

  it ('initializes synchronously without any options', function () {
    var psl = new PublicSuffixList();
    psl.initializeSync();
  });

  it ('initializes synchronously with a buffer', function () {
    var psl = getExample('buffer');
    psl.initializeSync();
  });

  it ('initializes synchronously with lines', function () {
    var psl = getExample('lines');
    psl.initializeSync();
  });

});
