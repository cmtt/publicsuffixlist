# Changes

0.3.0
 + Correcting an issue with recent Node.js versions.
 + Dropping support for Node.js below 5.x.

0.2.8
+ Maintenance release, reducing amount of dependencies in production

0.2.7
+ Maintenance release, updating dependencies, setting up Travis/Coveralls

0.2.6
+ Updating build system using [gulp-di](https://github.com/cmtt/gulp-di)

0.2.4, 0.2.5
+ addressing certificate validation issues
+ adding gulp tasks "jshint" and "mocha"

0.2.3
+ correcting a rule lookup issue

0.2.2
+ Adding an initializeSync() method
+ fixed some typing and syntax errors

0.2.1
+ Loading Mozilla's public suffix list by default when nothing else was
  declared

0.2.0
+ Adding ability to load rules from buffers, files and arrays of rules
+ API change: removing .parse(), asynchronous initialization
+ adding .domain()
+ re-written unit tests
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
