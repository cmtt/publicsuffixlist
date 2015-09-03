var tick = require('next-tick');
var __slice = [].slice;

/**
 * @function
 * @param {Function[]} fns
 * @param {Function} callback
 */

module.exports = function _waterfall (fns, callback) {
  var fnArgs = __slice.apply(arguments);
  if (fnArgs.length === 1) callback = fns.pop();
  if (typeof callback !== 'function') throw new Error('Function expected');

  _next(null);

  function _next (err) {
    var args = __slice.apply(arguments);
    err = args.shift() || null;
    tick(function () {
      if (err) return callback(err);
      var fn = fns.shift();
      if (typeof fn === 'function') args.push(_next);
      else {
        args.unshift(null);
        fn = callback;
      }
      fn.apply(null, args);
    });
  }
};
