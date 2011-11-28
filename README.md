PublicSuffixList
================

This module makes use of the [Public Suffix List](http://www.publicsuffix.org)
used in modern browsers like Google Chrome, Mozilla Firefox and Opera for
validating domain names.

## Installation

The PSL module can be installed via npm or manually.

A current copy of the Public Suffix List will be downloaded when npm is used. 

After a manual installation, the download_list.js script should be started in
order to download a current copy of the list from publicsuffix.org.

## Usage

    var psl = require('publicsuffixlist');

    var validDomain = psl.validate('example.io');
    // validDomain === true

    var invalidDomain = psl.validate('example.yz');
    // invalidDomain === false

    var result = psl.parse('www.domain.com');
    // result === 'domain.com'    

    var subdomain = psl.subdomain;
    // subdomain ===  'www'

    var domain = psl.domain;
    // domain === 'domain'

    var tld = psl.tld;
    // tld === 'com'

## Tests

Tests are included in the test/ directory.

## TODO

+ Improve domain validation
+ return results as new objects instead of pointers 

Further reading
---------------
* [http://www.publicsuffix.org](publicsuffix.org)
* [https://wiki.mozilla.org/Public_Suffix_List](Mozilla Wiki: Public Suffix List)

Credits
-------

* [Simone Carletti](http://www.simonecarletti.com/code/public_suffix_service/)
* domainname-parser.googlecode.com

License
-------

MIT License.
