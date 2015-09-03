// Download script, part of the npm installation routine.

var fs = require('fs');
var path = require('path');
var https = require('https');
var config = require('./config');
var waterfall = require('./lib/waterfall');

var source = config.sources[config.source];
if (!source) throw new Error('Source not found: ' + config.source);

var tldFile = path.join(__dirname, source.file);

(fs.exists || path.exists)(tldFile, function(exists) {

  if (exists) return process.exit(0);

  downloadSource(source, tldFile, function(err) {
    if (err) throw err;
    process.stdout.write('\n');
    process.exit(0);
  });

});

/**
 * @method downloadSource
 * @param {object} source
 * @param {function} callback
 */

function downloadSource (source, dest, callback) {

  var request = null;
  var length = -1;

  /**
   * @method onResponse
   * @param {object} res
   * @param {function} next
   * @private
   */

  function onResponse(res, next) {
    var read = 0;
    var body = [];

    if (res.statusCode !== 200) {
      request.destroy();
      return next(new Error('Received ' + res.statusCode + ' ' + res.statusMessage  + '.'));
    }

    log('Downloading from ' + source.host);

    var contentLength = res.headers['content-length'];
    if (typeof contentLength === 'string') length = parseInt(contentLength, 10);
    if (~length) process.stdout.write(' (' + (~~(length / 1024)) + 'KB)');
    process.stdout.write('...\n');

    res.addListener('data', function (chunk) {
      read += chunk.length;
      log( ~~(read / 1024), 'KB read');
      if (~length) {
        process.stdout.write( ' (' + ~~((read / length) * 100) + ' %)');
      }
      body.push(chunk);
    });

    res.addListener('end', function() {
      request.destroy();
      var buffer = Buffer.concat(body);
      if (~length && buffer.length !== length) {
        return next(new Error('Length mismatches'));
      }
      next(null, buffer);
    });
  }

  waterfall([
    function (next) {
      var requestOptions = {
        host : source.host,
        path : source.path,
        rejectUnauthorized : !!config.verifyCertificates,
        method : 'GET'
      };
      if (typeof source.port === 'number') requestOptions.port = source.port;
      request = https.request(requestOptions);
      next(null, request);
    },
    function (request, next) {
      log('Connecting to ' + source.host + '...');
      request.on('response', function (response) {
        onResponse(response, next);
      });
      request.once('error', next);
      request.end();
    },
    function (body, next) {
      log(~~(body.length / 1024), 'KiB read');
      fs.writeFile(dest, body, next);
    },
    function(next){
      log( ~~(length / 1024), 'KB written to', dest);
      next(null);
    }
  ], callback);
}

/**
 * @method log
 * @param {*}
 */

function log(){
  var args = [].slice.apply(arguments);
  args.unshift('publicsuffixlist', ':');
  var line = args.join(' ');
  var l = 80 - line.length;
  process.stdout.write('\r'+ new Array(80).join(' '));
  process.stdout.write('\r' + line);
}
