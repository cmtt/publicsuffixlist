var waterfall = require('./waterfall');
var is = require('./is');
var each = require('./each');
var rtrim = require('./rtrim');
var trim = require('./trim');
var filter = require('./filter');
var TYPE_EXCEPTION = 1;
var TYPE_WILDCARD = 2;
var TYPE_RULE = 3;
var TYPES = [TYPE_RULE, TYPE_WILDCARD, TYPE_EXCEPTION];

module.exports = RuleLoader;

/**
 * @function
 * @param {object} options
 * @returns {object}
 */

function RuleLoader (options) {
  options = is.Object(options) ? options : {};
  var _ruleLoader = {
    // @ifndef BROWSER
    initialize : _initialize,
    // @endif
    initializeSync : _initializeSync,
    rules : null,
    options : options,
    // @ifndef BROWSER
    loadFile : _loadFile,
    loadBuffer : _loadBuffer,
    parseBuffer : _parseBuffer,
    // @endif
    readRules : _readRules,
    findRules : _findRules
  };

  return _ruleLoader;
}

/**
 * @function
 * @param {function} callback
 */

function _initialize (callback) {
  var self = this;
  waterfall([
    function (next) {
      if (is.String(self.options.filename)) return self.loadFile(self.options.filename, next);
      if (is.Buffer(self.options.buffer)) return self.loadBuffer(self.options.buffer, next);
      if (is.Array(self.options.lines)) return next(null, self.options.lines);
      next(new Error('E_NO_RULES'));
    },
    function (lines, next) {
      if (!lines.length) return next(new Error('E_NO_RULES'));
      self.rules = self.readRules(lines);
      next(null);
    }
  ], callback);
}

/**
 * @function
 * @param {function} callback
 */

function _initializeSync () {
  var lines = null;
  // @ifndef BROWSER
  if (is.String(this.options.filename)) {
    lines = this.loadFile(this.options.filename, null, true);
  } else if (is.Buffer(this.options.buffer)) {
    lines = this.loadBuffer(this.options.buffer, null, true);
  } else // @endif
  if (is.Array(this.options.lines)) {
    lines = this.options.lines;
  } else {
    throw Error('E_NO_RULES');
  }

  if (!lines.length) throw new Error('E_NO_RULES');

  this.rules = this.readRules(lines);
}
/**
 * @function
 * @param {string[]} lines
 * @returns {object} rules
 */

function _readRules (lines) {
  var rules = {};

  each(TYPES, function (type) { rules[type] = []; });

  for (var i = 0, line = null, l = lines.length; i < l; ++i) {
    line = trim(lines[i]);
    var type = TYPE_RULE;
    switch (line.charAt(0)) {
      case '!':
        type = TYPE_EXCEPTION;
        line = line.substring(1,line.length);
        break;
      case '*':
        type = TYPE_WILDCARD;
        line = line.substring(2,line.length);
        break;
    }
    rules[type].push(line);
  }
  return rules;
}

/**
 * @function
 * @param {string}
 * @return {object}
 */

function _findRules (domainString) {
  var self = this;
  if (!is.Object(this.rules)) return new Error('E_NOT_INITIALIZED');
  if (!is.String(domainString)) return null;
  var domainParts = domainString.split(/\./);
  var checkAgainst = '';
  var results = {};
  while (domainParts.length > 0) {
    var part = domainParts.pop();
    checkAgainst = rtrim([part,'.', checkAgainst].join(''),'.');
    var _filter = _checkAgainst(checkAgainst);
    for (var i = 0, type = null, l = TYPES.length; i < l; ++i) {
      type = TYPES[i];
      var typeResults = filter(self.rules[type], _filter);
      results[type] = results[type] || [];
      results[type] = results[type].concat(typeResults);
    }
  }

  return results;

  /**
   * @function
   * @param {string} checkAgainst
   * @return {function}
   */

  function _checkAgainst (checkAgainst) {
    return function(rule) { return checkAgainst === rule; };
  }
}

// @ifndef BROWSER

/**
 * @function
 * @param {string} filename
 * @param {function} callback
 * @param {boolean} sync
 */

function _loadFile (filename, callback, sync) {
  var fs = require('fs');
  var self = this;
  if (sync) {
    var buffer = fs.readFileSync(filename);
    return this.parseBuffer(buffer);
  }
  fs.readFile(filename, function (err, buffer) {
    if (err) return callback(err);
    callback(null, self.parseBuffer(buffer));
  });
}

/**
 * @function
 * @param {object} filename
 * @param {function} callback
 * @param {boolean} sync
 */

function _loadBuffer (buffer, callback, sync) {
  if (sync) {
    return this.parseBuffer(buffer);
  }
  callback(null, this.parseBuffer(buffer));
}

/**
 * @function
 * @param {object} buffer
 * @returns {string[]} lines
 */

function _parseBuffer (buffer) {
  var lineDelimiter = /\n/;
  if (is.Number(this.options.fileFormat) && this.options.fileFormat === 1) {
    lineDelimiter = /\r/;
  }

  var commentRgx = /^[^\/\/]/;
  var lines = buffer.toString('utf8').split(lineDelimiter);
  lines = filter(lines, function (line) {
    return commentRgx.test(line);
  });
  return lines;
}

//@endif
