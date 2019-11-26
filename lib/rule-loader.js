var waterfall = require('./waterfall');
var is = require('./is');
var rtrim = require('./rtrim');
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
    initialize : _initialize,
    initializeSync : _initializeSync,
    rules : null,
    options : options,
    loadFile : _loadFile,
    loadBuffer : _loadBuffer,
    parseBuffer : _parseBuffer,
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

  if (is.String(this.options.filename)) lines = this.loadFile(this.options.filename, null, true);
  else if (is.Buffer(this.options.buffer)) lines = this.loadBuffer(this.options.buffer, null, true);
  else if (is.Array(this.options.lines)) lines = this.options.lines;
  else throw Error('E_NO_RULES');

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

  TYPES.forEach(function (type) { rules[type] = []; });

  lines.forEach(function (line) {
    line = line.trim();
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
  });
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

  /**
   * @method checkType
   * @param {number} type
   * @private
   */

  function checkType (type) {
    var typeResults = self.rules[type].filter(function(rule) {
      return checkAgainst === rule;
    });
    results[type] = results[type] || [];
    results[type] = results[type].concat(typeResults);
  }
  while (domainParts.length > 0) {
    var part = domainParts.pop();
    checkAgainst = rtrim([part,'.', checkAgainst].join(''),'.');
    TYPES.forEach(checkType);
  }
  return results;
}

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
  var lines = buffer.toString('utf8')
  .split(lineDelimiter)
  .filter(commentRgx.test.bind(commentRgx));
  return lines;
}
