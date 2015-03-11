var PublicSuffixList = require('./index.js');
var EFFECTIVE_TLD_NAMES = '{{ effective_tld_names.dat }}';
var LZString = require('lz-string');
var lines = atob(LZString.decompressFromBase64(EFFECTIVE_TLD_NAMES)).split(/\n/g);
window.psl = new PublicSuffixList({ lines : lines });
psl.initializeSync();
