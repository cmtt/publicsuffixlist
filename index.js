module.exports = PublicSuffixList;

var is = require('./lib/is');
var waterfall = require('./lib/waterfall');
var RuleLoader = require('./lib/rule-loader');

var TYPE_EXCEPTION = 1;
var TYPE_WILDCARD = 2;
var TYPE_RULE = 3;
var TYPES = [TYPE_RULE, TYPE_WILDCARD, TYPE_EXCEPTION];

function PublicSuffixList (options) {
  options = is.Object(options) ? options : {};

  var psl = {
    options : options,
    ruleLoader : new RuleLoader(options),
    initialize : _initialize,
    lookup : _lookup,
    domain : _domain,
    validate : _validate,
    validateTLD : _validateTLD,
    tld : _tld
  };
  return psl;
}

/**
 * @function
 * @param {function} callback
 */

function _initialize (callback) {
  var self = this;
  waterfall([
    function (next) {
      self.ruleLoader.initialize(next);
    }
  ], callback);
}

/**
 * @function
 * @param {string} domainString
 * @returns {string} fqdn
 */

function _domain (domainString) {
  var result = this.lookup(domainString);
  if (!result) return null;
  if (result.exception) return null;
  var fqdn = result.domain + '.' + result.tld;
  return fqdn;
}

/**
 * @function
 * @param {string} tldString
 * @returns {string} tld
 */

function _tld (tldString) {
  var result = this.lookup(tldString, true);
  if (!result) return null;
  if (result.type === TYPE_EXCEPTION) return null;
  var rgx = null;
  if (result.type === TYPE_WILDCARD) rgx = new RegExp('(.*)(\.)?('+result.rule+')','i');
  else if (result.type === TYPE_RULE) rgx = new RegExp('^(\.)?('+result.rule+')','i');
  return rgx.test(tldString) ? result.rule : null;
}

/**
 * @function
 * @param {string} domainString
 * @returns {boolean}
 */

function _validate (domainString) {
  var result = this.lookup(domainString);
  return !!result && result.exception !== true;
}

/**
 * @function
 * @param {string} domainString
 * @returns {boolean}
 */

function _validateTLD (tldString) {
  var result = this.lookup(tldString, true, true);
  if (!result || result.type === TYPE_EXCEPTION) return false;
  var rgx = null;
  if (result.type === TYPE_WILDCARD) rgx = new RegExp('(.*)(\.)?('+result.rule+')','i');
  else if (result.type === TYPE_RULE) rgx = new RegExp('^(\.)?('+result.rule+')','i');
  return rgx.test(tldString);
}

/**
 * @function
 * @param {string} domainString
 * @param {boolean} ruleOnly
 * @param {boolean} ignoreLeadingDot
 * @returns {object} result
 */

function _lookup (domainString, ruleOnly, ignoreLeadingDot) {
  if (!is.String(domainString)) return null;
  if (!ignoreLeadingDot && domainString.charAt(0) === '.')  return null;

  domainString = domainString.toLowerCase();
  var matchingRules = this.ruleLoader.findRules(domainString);
  var results = [];
  TYPES.forEach(function (type) {
    var rules = matchingRules[type];
    rules = rules
    .map(function (rule) {
      return {
        type : type,
        rule : rule,
        length : rule.length
      };
    });
    results = results.concat(rules);
  });

  if (!results.length) return null;

  results.sort(function (a, b) { return a.length < b.length; });
  var matchingRule = results[0];
  if (ruleOnly) return matchingRule;
  var tldIndex = -1;
  if (matchingRule.type === TYPE_RULE || matchingRule.type === TYPE_WILDCARD) {
    tldIndex = domainString.indexOf('.' + matchingRule.rule);
  } else if (matchingRule.type === TYPE_EXCEPTION) {
    tldIndex = domainString.lastIndexOf('.');
  }

  var domainPart = domainString.substring(0, tldIndex);
  if (typeof domainPart !== 'string') return null;

  if (matchingRule.type === TYPE_WILDCARD) {
    tldIndex = domainPart.lastIndexOf('.');
    domainPart = domainString.substring(0, tldIndex);
  }
  var remainingParts = domainPart.split(/\./).filter(function(p) { return !!p.length; });
  if (!remainingParts.length) return null;

  var result = {};

  if (matchingRule.type === TYPE_EXCEPTION) {
    result.rule = matchingRule.rule;
    result.exception = true;
  } else if (matchingRule.type === TYPE_WILDCARD) {
    result.rule = matchingRule.rule;
  }

  result.domain = remainingParts[remainingParts.length-1];
  result.tld = domainString.substring(tldIndex + 1);

  if (remainingParts.length > 1) result.subdomain = domainPart.substring(0, domainPart.length - result.domain.length - 1);
  return result;
}
