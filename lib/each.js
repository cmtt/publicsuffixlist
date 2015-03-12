/**
 * @function
 * @param {*[]} arr
 * @param {function} fn
 */

function _each (arr, fn) {
  for (var i = 0, l = arr.length; i < l; ++i) {
    fn.call(null, arr[i], i, arr);
  }
}

module.exports = _each;
