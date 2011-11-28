// rtrim taken from Underscore.string, (c) 2011 Esa-Matti Suurone under MIT Licence
// https://github.com/epeli/underscore.string

var rtrim = function(str, characters){
	characters = characters.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
	return str.replace(new RegExp('[' + characters + ']+$', 'g'), '');
}

var path = require('path');
var fs = require('fs');

var tldFileName = path.join(__dirname ,'effective_tld_names.dat');

if (path.existsSync(tldFileName)) {
	var tldFile = fs.readFileSync(tldFileName, 'utf8');
	var tldRules = tldFile.split('\n');
	delete tldFile;
	var rules  = {};
	tldRules.forEach(function(rule) {
		rule = rule.trim();
		if (rule.substr(0, 2) !== '//' && rule.length > 0) {
			switch (rule.charAt(0)) {
				case '!':
					var type = 'exception';
					rule = rule.substring(1,rule.length);
					break;
				case '*':
					var type = 'wildcard';
					rule = rule.substring(2,rule.length);
					break;
				default: var type = 'rule';	break;
			}
			if (!rules[type]) rules[type] = [];
			rules[type].push(rule);
		}
	});
	delete tldRules;
} else {
	throw new Error(tldFileName + ' not found');
}

function PublicSuffixList () {
	var self = {
		parse : function (domainString) {
			self.reset();
			if (typeof domainString !== 'string' || domainString.substr(0,1) === '.')  return null;

			domainString = domainString.toLowerCase();
			var result = _findMatchingTLDRule(domainString);

			if (!result) return null;

			switch (result.type) {
				case 'rule':
					var tldIndex = domainString.indexOf('.'+result.rule);
					var domainPart = domainString.substring(0, tldIndex);
					var TLD = domainString.substring(tldIndex + 1);
					break;
				case 'wildcard':
					var tldIndex = domainString.indexOf('.'+result.rule);
					var domainPart = domainString.substring(0, tldIndex);
					var tldIndex = domainPart.lastIndexOf('.');
					domainPart = domainString.substring(0, tldIndex);
				    var TLD = domainString.substring(tldIndex + 1);
					break;
				case 'exception':
					var tldIndex = domainString.lastIndexOf('.');
					var domainPart = domainString.substring(0, tldIndex);
					var TLD = domainString.substring(tldIndex + 1);
					break;
			}			
			if (!domainPart) return null; 
			
			var remainingParts = domainPart.split('.');

			if (remainingParts.length === 0) return null;
			self.domain = remainingParts[remainingParts.length - 1];
			self.tld = TLD;

			if (remainingParts.length > 1) self.subdomain = domainPart.substring(0, domainPart.length - self.domain.length - 1);

			if (result.type === 'exception') return result.rule;
			return self.domain + '.' + self.tld;
		},
		reset : function () {
			['tld','subdomain','domain'].forEach(function(param) {
				self[param] = null;
			});			
		},
		validate : function(domainString) {
			self.parse(domainString);
			if (self.domain === null) return false;
			return true;
		}
	}
	self.reset();
	return self;
}

function _findMatchingTLDRule(domainString) {
	var ruleTypes = ['exception','wildcard','rule'];

	if (typeof domainString !== 'string') return null;
	var domainParts = domainString.split('.');
	var checkAgainst = '';	
	var results = {};
	do {
		var domainPart = domainParts.pop();
		checkAgainst = rtrim(domainPart  + '.' + checkAgainst,'.');
		ruleTypes.forEach(function(type) {
			if (!results[type]) results[type] = [];
			var matches = rules[type].filter(function(rule) {	return (checkAgainst === rule ? true : false);	})
			if (matches.length > 0) results[type].push(matches);
		});

	} while (domainParts.length > 0);

	var longestResult = { type : '' , len : 0, idx :0 };

	ruleTypes.forEach(function(type) {
		var Result = { type : '' , len : 0, idx :0 }
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

module.exports = new PublicSuffixList;