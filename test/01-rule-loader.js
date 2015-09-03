describe('RuleLoader', function () {
  var RuleLoader = require(basePath('lib','rule-loader'));
  var is = require(basePath('lib','is'));
  var exampleDataFile = basePath('test', 'fixtures', 'example.dat');
  var exampleDataExpectedLines = [ 'zyx', 'domain.zyx', '*.yxz', '!none.yxz', '!null.yxz' ];

  it ('can be initialized', function () {
    assert.ok(is.Function(RuleLoader));
    var loader = new RuleLoader();
    assert.ok(is.Object(loader));
  });

  it ('parseBuffer', function (done) {
    var loader = new RuleLoader();
    assert.ok(is.Function(loader.parseBuffer));
    var buffer = new Buffer(['// Example', '', 'lines', '' ].join('\n'));
    loader.loadBuffer(buffer, function (err, lines) {
      if (err) throw err;
      assert.equal(lines.length, 1);
      assert.deepEqual(lines, ['lines']);
      done();
    });
  });

  it ('loadFile', function (done) {
    var loader = new RuleLoader();
    assert.ok(is.Function(loader.loadFile));
    loader.loadFile(exampleDataFile, function (err, lines) {
      if (err) throw err;
      assert.equal(lines.length, 5);
      assert.deepEqual(lines, exampleDataExpectedLines);
      done();
    });
  });

  it ('loadBuffer \\n', function (done) {
    var loader = new RuleLoader();
    assert.ok(is.Function(loader.loadBuffer));
    var buffer = new Buffer(exampleDataExpectedLines.join('\n'));
    loader.loadBuffer(buffer, function (err, lines) {
      if (err) throw err;
      assert.equal(lines.length, 5);
      assert.deepEqual(lines, exampleDataExpectedLines);
      done();
    });
  });

  it ('loadBuffer \\r', function (done) {
    var loader = new RuleLoader({ fileFormat : 1 });
    var buffer = new Buffer(exampleDataExpectedLines.join('\r'));
    loader.loadBuffer(buffer, function (err, lines) {
      if (err) throw err;
      assert.equal(lines.length, 5);
      assert.deepEqual(lines, exampleDataExpectedLines);
      done();
    });
  });

});
