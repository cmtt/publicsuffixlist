// Download script, part of the npm installation routine.

var fs = require('fs')
  , path = require('path')
  , http = require('http');

var fExists = (function () {
  return fs.exists || path.exists;
})();

var sources = {
  tld : {
    host : 'mxr.mozilla.org',
    path : '/mozilla-central/source/netwerk/dns/effective_tld_names.dat?raw=1',
    file : 'effective_tld_names.dat'
  },
  generic : {
    host : 'newgtlds.icann.org',
    path : '/sites/default/files/reveal/strings-1200utc-13jun12-en.csv',
    file : 'strings-1200utc-13jun12-en.csv'
  }
}

function promptYN (str, callback) {
  process.stdin.resume();
  process.stdin.write('\n'+str.toString()+ ' ');

  var timer = setTimeout(function () {
    process.stdin.pause();
    process.stdin.removeAllListeners();
    process.stdin.write(' (timeout)\n');
    callback(null, false);
  },20e3);

  process.stdin.on('data', function (txt) {
    var c = txt.toString().charAt(0)
      , answer = /(j|y)/i.test(c);
      
    clearTimeout(timer);
    if (/(j|y|n)/i.test(c) === false) {
      process.stdin.write('\r'+str.toString()+ ' [y/n] ');
      return;
    }
    process.stdin.pause();
    process.stdin.removeAllListeners();
    callback(null, answer);
  });
}

function downloadFile (options, callback) {
  var request = http.request({
    host : options.host,
    path : options.path,
    port : 80,
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
  console.log('Downloading http://' + sources[key].host+ sources[key].path)
  downloadFile(sources[key],function (err) {
    callback(err);
  });
}

function downloadTld (callback) {
  fExists(path.join(__dirname,sources['tld'].file), function(exists) {
    if (exists === false) {
      demandSource('tld', callback);
      return;
    }      
    promptYN('The Public Suffix List has been downloaded already. Do you want to download this list again?', function (err,answer) {
      if (answer === false) {
        callback(null);
        return;
      }
      demandSource('tld', callback);
    });
  });
}

function downloadGeneric (callback) {
  fExists(path.join(__dirname,sources['generic'].file), function(exists) {
    if (exists === false) {
      promptYN('Do you want this module to support the generic top level domains (for example .app, .zero)\nbeing introduced in 2013?\nMore information at http://newgtlds.icann.org/en/program-status/application-results/strings-1200utc-13jun12-en  ', function (err,answer) {
        if (answer === false) {
          callback(null);
          return;
        }
        demandSource('generic', callback);
      });
      return;
    } 
    promptYN('The list of generic TLD has been downloaded already. Do you want to download this list again?', function (err,answer) {
      if (answer === false) {
        callback(null);
        return;
      }
      demandSource('generic',callback);
    });
  });
}

downloadTld(function (err) {
  if (err) {
    throw new Error(err);
    process.exit();
  }
  downloadGeneric(function (err) {
    if (err) {
      throw new Error(err);
    }
    process.exit();
  });
});
