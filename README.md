PublicSuffixList
================

This module validates domain names and top level domains, making use of the
[Public Suffix List](http://www.publicsuffix.org) used in modern browsers like
Google Chrome, Mozilla Firefox and Opera.

In addition, it can be used to validate the upcoming general top level domains
being introduced in 2013, according to [ICANN](http://newgtlds.icann.org/en/program-status/application-results/strings-1200utc-13jun12-en).

## Installation

The module can be installed via npm or manually by cloning this repository.

    npm install publicsuffixlist

A current copy of the Public Suffix List will be downloaded automatically
when npm is used. The installation routine asks if the gTLD list should be
downloaded. 

After a manual installation, it is necessary to run the download_list.js script
in order to download these lists.

## Usage

The module provides the following functions.

### lookup (domainString)

lookup returns an object providing the distinct results for the queried string or
null in case of an invalid query. 

    var result = psl.lookup('www.domain.com');

    /* result === { domain: 'domain',
                  tld: 'com',
                  subdomain: 'www' } */

### validateTLD (tld)

Validates the provided top level domain. Returns true or false.

    var validTLD = psl.validateTLD('de'); // true
    var invalidTLD = psl.validateTLD('ed'); // false

### parse (domainString)

This function returns the domain name including the TLD in case of a valid string,
otherwise null.

For compatibility reasons, the module provides access to the distinct results in
addition. However, for running multiple queries asynchronically, the lookup
function should be used instead.

    var domain = psl.parse('subdomain.domain.de');

    // domain === 'domain.de'
    // psl.subdomain === 'subdomain'
    // psl.domain === 'domain'
    // psl.tld === 'de'

### validate (domainString)

Returns true when the provided domain is valid, otherwise false.

    var validDomain = psl.validate('domain.de'); // true
    var invalidDomain = psl.validate('domain.yz'); // false

## Tests

Tests are included in the test/ directory.

## Changes

0.1.31
+ adapting to current Node's API changes in order to remove the warning messages
+ updated tests
+ fixed some typing and syntax errors

0.1.3
+ added support for generic TLDs
+ added lookup() and validateTLD()

0.1.1, 0.1.2
+ Removed dependency on [Underscore.js](http://documentcloud.github.com/underscore/) 
+ added support for automatic installation on the Windows platform

0.1.0
+ first release

## TODO

+ Improve domain validation

Further reading
---------------
* [publicsuffix.org](http://www.publicsuffix.org)
* [Mozilla Wiki: Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List)
* [ICANN: Reveal of gTLDs applied for](http://newgtlds.icann.org/en/program-status/application-results/strings-1200utc-13jun12-en)

Credits
-------

* [Simone Carletti](http://www.simonecarletti.com/code/public_suffix_service/)
* domainname-parser.googlecode.com

License
-------

MIT License.
