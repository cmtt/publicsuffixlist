/**
 * This file contians helper functions for running the unit tests.
 */

global.assert = require('assert');

var fs = require('fs');
var path = require('path');

var exampleDataFile = _basePath('spec', 'fixtures', 'example.dat');
var pslDataFile = _basePath('effective_tld_names.dat');
var exampleDataBuffer = fs.readFileSync(exampleDataFile);
var PublicSuffixList = require(_basePath('index'));

global.basePath = _basePath;
global.getExample = _getExample;
global.getPublicSuffixList = _getPublicSuffixList;

/**
 * @function
 * @returns {string}
 */

function _basePath () {
  var args = Array.prototype.slice.apply(arguments).map(String);
  return path.join.apply(path,[__dirname,'..'].concat(args));
}

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
