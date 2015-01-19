// Download script, part of the npm installation routine.

var fs = require('fs');
var path = require('path');
var https = require('https');

var fExists = (function () {
  return fs.exists || path.exists;
})();

var sources = {
  tld : {
    host : 'publicsuffix.org',
    path : '/list/effective_tld_names.dat?raw=1',
    file : 'effective_tld_names.dat'
  }
};

function downloadFile (options, callback) {
  var request = https.request({
    host : options.host,
    path : options.path,
    method : 'GET'
  });

  request.on('error', function (err) {
    request.destroy();
    callback(err);
  });

  request.on('failure', function (err) {
   request.destroy();
    callback(err);
  });

  request.on('response', function (response) {
    if (response.statusCode === 200) {
      process.stdout.write('\rDownloading to ' + options.file + '...');
      response.setEncoding('binary');
      var body = '';

      response.addListener('data', function (chunk) {  body += chunk; });
      response.addListener('end', function() {
        fs.writeFileSync(path.join(__dirname,options.file), body.toString('binary'), 'binary');
        process.stdout.write('\r'+ ~~(body.length/1024) +' KB written to ' + options.file + '.' + new Array(10).join(' ') + '\n');
        callback(null);
        request.destroy();
      });
    } else {
      request.destroy();
      callback(new Error ('Received ' + response.statusCode.toString() + ' instead of 200.'));
    }
  });
  process.stdout.write('Contacting ' + options.host + '...');
  request.end();
}

function demandSource (key, callback) {
  console.log('Downloading https://' + sources[key].host + sources[key].path);
  downloadFile(sources[key],function (err) {
    callback(err);
  });
}

function downloadTld (callback) {
  fExists(path.join(__dirname,sources.tld.file), function(exists) {
    if (exists === false) {
      demandSource('tld', callback);
      return;
    }
  });
}

downloadTld(function (err) {
  if (err) {
    throw new Error(err);
  }
  process.exit();
});
