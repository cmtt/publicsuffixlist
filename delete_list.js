// Introduced for Windows compatibility when removing the module.

var fs = require('fs');
var path = require('path');

var tldFileName = path.join(__dirname ,'effective_tld_names.dat');

if (path.existsSync(tldFileName)) fs.unlinkSync(tldFileName);	
