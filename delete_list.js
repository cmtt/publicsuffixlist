// Removal script, part of the npm removal routine

var fs = require('fs'),
  path = require('path'),
  tldSourceFiles = ['effective_tld_names.dat','strings-1200utc-13jun12-en.csv'];

tldSourceFiles.forEach(function(f) {
  var tldFileName = path.join(__dirname ,f);
  if (path.existsSync(tldFileName)) {
    console.log('Removing',f);
    fs.unlinkSync(tldFileName);
  }
});