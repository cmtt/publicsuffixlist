describe('PublicSuffixList', function () {
  var PublicSuffixList = getPublicSuffixList();
  var fs = require('fs');
  var is = require(basePath('lib','is'));

  it ('is present', function () {
    assert.ok(is.Function(PublicSuffixList));
  });

  it ('initializes with rule file', function (done) {
    var psl = getExample('file');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes with rule file', function (done) {
    var psl = getExample('buffer');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

  it ('initializes with lines', function (done) {
    var psl = getExample('lines');
    psl.initialize(function (err) {
      assert.ok(!err);
      done();
    });
  });

});
