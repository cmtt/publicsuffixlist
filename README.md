PublicSuffixList
================

This module validates domain names and top level domains, making use of the
[Public Suffix List](http://www.publicsuffix.org) used in modern browsers like
Google Chrome, Mozilla Firefox and Opera.

## Installation

The module can be installed via npm or manually by cloning this repository.

    npm install publicsuffixlist

A current copy of the Public Suffix List will be downloaded automatically
when npm is used.

After a manual installation, it is necessary to run the download_list.js script
in the root folder in order to download this list.

## Running the unit tests

Please download and install the [Mocha](http://mochajs.org) test framework
globally (you might have to have superuser rights):

```bash
npm install mocha -g
```

Then run the following command:

```bash
mocha spec
```

## Usage

### Initialization and options

```js
var PublicSuffixList = require('publicsuffixlist');
var psl = new PublicSuffixList(options);
```
options:
##### ``filename {string}``
Supplies a filename as source for the data file. By default it'll be the file loaded while installation.

##### ``buffer {object}``
Supplies a buffer as source for the data file.

##### ``lines {string[]}``
Supplies an array of stringd as source for the data file.

### Methods:

##### ``.initialize(callback)``
Loads all rules from the specified source.

##### ``.lookup(domainString)``
lookup() returns an object providing the distinct results for the queried
string or null in case of an invalid query.

```js
var result = psl.lookup('www.domain.com');

/* result === { domain: 'domain',
              tld: 'com',
              subdomain: 'www' } */
```

##### ``.domain(domainString)``

Get the assignable domain from the fully qualified domain name.

```js
var result = psl.domain('www.domain.com');

/* result === 'domain.com' */
```

##### ``.validateTLD (tld)``

Validates the provided top level domain. Returns true or false.

```js
var validTLD = psl.validateTLD('de'); // true
var invalidTLD = psl.validateTLD('ed'); // false
```

##### ``.validate (domainString)``

Returns true when the provided domain is valid, otherwise false.

```js
var validDomain = psl.validate('domain.de'); // true
var invalidDomain = psl.validate('domain.yz'); // false
```

## Tests

Tests are included in the test/ directory.

## Changes

0.2.0
+ Adding ability to load rules from buffers, files and arrays of rules
+ API change: removing .parse(), asynchronous initialization
+ adding .domain()
+ re-written unit tests

0.1.32
+ changing the publicsuffix list URL

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

Further reading
---------------
* [publicsuffix.org](http://www.publicsuffix.org)
* [Mozilla Wiki: Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List)

Credits
-------

* [Morton Swimmer](https://github.com/mswimmer) forked this library, added
  a .domain() method and updated the URL of the list
* [Simone Carletti](http://www.simonecarletti.com/code/public_suffix_service/)
* domainname-parser.googlecode.com

License
-------

MIT License.
