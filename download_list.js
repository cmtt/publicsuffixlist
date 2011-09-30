var fs = require('fs');
var path = require('path');
var http = require('http');

var host = 'mxr.mozilla.org'
var tldFileName = path.join(__dirname ,'effective_tld_names.dat');

console.log('Downloading Public Sufffx List from mxr.mozilla.org...');

var request = http.request({
	'host': host,
	'port': 80,
	'path' : '/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1',
	'method' : 'GET'
});

request.on('error', function (err) {
	throw new Error(err);
});

request.on('failure', function (err) {
	throw new Error(err);
});	

request.on('response', function (response) {
	if (response.statusCode === 200) {
		response.setEncoding('binary');
		var body = '';

		response.addListener('data', function (chunk) {	body += chunk; });
		response.addListener('end', function() {
			fs.writeFileSync(tldFileName, body.toString('binary'), 'binary');
			console.log('Public Suffix List downloaded to ',tldFileName);
			process.exit();
		});
	} else {
		console.log('You need to download effective_tld_names.dat from http://publicsuffix.org to ' + tldFileName);
		throw new Error ('Received ' + response.statusCode.toString() + ' instead of 200.');
});

if (!path.existsSync(tldFileName)) request.end();
else process.exit();