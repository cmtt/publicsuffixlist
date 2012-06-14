// rtrim taken from Underscore.string, (c) 2011 Esa-Matti Suurone under MIT Licence
// https://github.com/epeli/underscore.string


var path = require('path')
	, fs = require('fs')
	, tldFileName = path.join(__dirname ,'effective_tld_names.dat')
	, gtldFileName = path.join(__dirname ,'strings-1200utc-13jun12-en.csv')
	, rules  = {}
	, TYPE_EXCEPTION = 1
	, TYPE_WILDCARD = 2
	, TYPE_RULE = 3;

var rtrim = function(str, characters){
	characters = characters.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	return str.replace(new RegExp('[' + characters + ']+$', 'g'), '');
};

var ruleLoader = function  (fileType,tldFileName) {
	var tldFile = fs.readFileSync(tldFileName, 'utf8')
		, rgx = fileType === 0 ? /\n/ : /\r/
		, tldRules = tldFile.split(rgx);

	delete tldFile;
	
	tldRules.forEach(function(rule) {
		if (fileType === 1 && rule.length > 0) {

			var values = rule.split(',')
				, domain = values[0].toLowerCase();

			rules[TYPE_RULE].push(domain);
			return;
		}

		rule = rule.trim();
		
		if (rule.substr(0, 2) !== '//' && rule.length > 0) {
			switch (rule.charAt(0)) {
				case '!':
					var type = TYPE_EXCEPTION;
					rule = rule.substring(1,rule.length);
					break;
				case '*':
					var type = TYPE_WILDCARD;
					rule = rule.substring(2,rule.length);
					break;
				default: var type = TYPE_RULE;	break;
			}
			if (!rules[type]) rules[type] = [];
			rules[type].push(rule);
		}
	});
	delete tldRules;	
}

function _findMatchingTLDRule (domainString) {
	if (typeof domainString !== 'string') return null;

	var ruleTypes = [TYPE_EXCEPTION,TYPE_WILDCARD,TYPE_RULE]
		, longestResult = { type : 0 , len : 0, idx :0 }
		, domainParts = domainString.split('.')
		, checkAgainst = ''	
		, results = {};

	do {
		var domainPart = domainParts.pop();
		checkAgainst = rtrim(domainPart  + '.' + checkAgainst,'.');
		ruleTypes.forEach(function(type) {
			if (!results[type]) results[type] = [];
			var matches = rules[type].filter(function(rule) {	return (checkAgainst === rule ? true : false);	})
			if (matches.length > 0) results[type].push(matches);
		});
	} while (domainParts.length > 0);

	ruleTypes.forEach(function(type) {
		var Result = { type : 0 , len : 0, idx :0 }
		results[type].forEach(function (result,idx) {
			if (result[0].length > Result.len) {
				Result.type = type;
				Result.rule = result[0];
				Result.len = Result.rule.length;
				Result.idx = idx;
			}
		});
		if (Result.len > longestResult.len) longestResult = Result;
	});	
	return (longestResult ? longestResult : Result);
}
if (path.existsSync(tldFileName)) ruleLoader(0,tldFileName);
else throw new Error(tldFileName + ' not found. Execute \n $ node ' + path.join(__dirname,'download_list.js')  +  '\n');

if (path.existsSync(gtldFileName)) ruleLoader(1,gtldFileName);

function PublicSuffixList () {
	var self = {
		parse : function (domainString) {

			var result = self.lookup(domainString), foundDomain = null;
			['domain','subdomain','tld'].forEach(function(e) {
				if (result === null) self[e] = null;
				else self[e] = typeof result[e] === 'string' ? result[e] : null;
			});
			if (result !== null) {
				if (result.exception) foundDomain = result.rule;
				else foundDomain = result.domain +'.'+ result.tld;
			}
			return foundDomain;
		},

		lookup : function (domainString) {
			if (typeof domainString !== 'string' || domainString.substr(0,1) === '.')  return null;

			domainString = domainString.toLowerCase();
			var matchingRule = _findMatchingTLDRule(domainString)
				, result = {};

			if (!matchingRule) return null;

			switch (matchingRule.type) {
				case TYPE_RULE:
					var tldIndex = domainString.indexOf('.' + matchingRule.rule)
						, domainPart = domainString.substring(0, tldIndex)
						, tld = domainString.substring(tldIndex + 1);
					break;
				case TYPE_WILDCARD:
					var tldIndex = domainString.indexOf('.' + matchingRule.rule)
						, domainPart = domainString.substring(0, tldIndex)
						, tldIndex = domainPart.lastIndexOf('.')
						, tld = domainString.substring(tldIndex + 1);
					domainPart = domainString.substring(0, tldIndex);
					break;
				case TYPE_EXCEPTION:
					var tldIndex = domainString.lastIndexOf('.')
						, domainPart = domainString.substring(0, tldIndex)
						, tld = domainString.substring(tldIndex + 1);
					break;
			}
			if (!domainPart) return null; 
			
			var remainingParts = domainPart.split('.');

			if (remainingParts.length === 0) return null;

			if (matchingRule.type === TYPE_EXCEPTION) {
				result.rule = matchingRule.rule;
				result.exception = true;
			}

			result.domain = remainingParts[remainingParts.length - 1],
			result.tld = tld;
			if (remainingParts.length > 1) result.subdomain = domainPart.substring(0, domainPart.length - result.domain.length - 1);			
			
			return result;
		},
		validate : function(domainString) {
			if (typeof domainString !== 'string' || domainString.substr(0,1) === '.')  return false;
			var result = self.lookup(domainString);
			return result === null ? false : true;
		},
		validateTLD : function(tldString) {
			if (typeof tldString !== 'string')  return false;
			var matchingRule = _findMatchingTLDRule(tldString);
			if (matchingRule.type === 0 || matchingRule.type === TYPE_EXCEPTION) return false;
			if (matchingRule.type === TYPE_WILDCARD) var rgx = new RegExp('(.+)(\.)('+matchingRule.rule+')','i');
			else var rgx = new RegExp('^(\.)?('+matchingRule.rule+')','i');
			return rgx.test(tldString);
		}
	}
	return self;
}

module.exports = new PublicSuffixList;