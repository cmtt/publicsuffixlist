module.exports = {};

var typeMatches = 'Null RegExp Buffer Array Boolean Date Function Number Object String Undefined'.split(' ');
for (var i = 0, l = typeMatches.length; i < l; ++i) module.exports[typeMatches[i]] = _matches(typeMatches[i]);

/**
 * @function
 * @param {String} key
 * @returns {Function}
 */

function _matches (key) {
  return function (arg) {
    if (key === typeMatches[0] && arg === null) return typeMatches[0];
    if (key === typeMatches[1] && arg instanceof RegExp) return typeMatches[1];
    if (typeof Buffer !== 'undefined' && key === typeMatches[2] && arg instanceof Buffer) return typeMatches[2];
    var t = Object.prototype.toString.call(arg).slice(8);
    return t.slice(0, t.length - 1) == key;
  };
}
