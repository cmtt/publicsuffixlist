
/**
 * @function
 * @param {object} arr
 * @param {function} fn
 * @returns {object} arr
 */

function _map (arr, fn) {
  var _arr = [], l = arr.length;
  for (var i = 0; i < l; ++i) _arr.push(fn(arr[i], i, arr));
  return _arr;
}

module.exports = _map;
