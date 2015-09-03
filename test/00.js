/**
 * This file contians helper functions for running the unit tests.
 */

global.assert = require('assert');

var fs = require('fs');
var path = require('path');

global.basePath = path.join.bind(path, __dirname, '..');
global.getExample = _getExample;
global.getPublicSuffixList = _getPublicSuffixList;

var exampleDataFile = basePath('test', 'fixtures', 'example.dat');
var pslDataFile = basePath('effective_tld_names.dat');
var exampleDataBuffer = fs.readFileSync(exampleDataFile);
var PublicSuffixList = require(basePath());

if (!fs.existsSync(pslDataFile)) throw new Error('Data file from publicsuffix.org is missing. Please run\n\n  $ node download_list.js.\n');

/**
 * @function
 * @returns {string}
 */

function _getExample (type) {
  var options = {};
  if (type === 'file') options.filename = exampleDataFile;
  else if (type === 'psl') options.filename = pslDataFile;
  else if (type === 'buffer') options.buffer = exampleDataBuffer;
  else if (type === 'lines') options.lines = exampleDataBuffer.toString('utf8').split(/\n/);
  else throw new Error('No type provided.');
  return new PublicSuffixList(options);
}

/**
 * @function
 * @returns {function}
 */

function _getPublicSuffixList () { return PublicSuffixList; }
