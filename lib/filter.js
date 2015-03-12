/**
 * @function
 * @param {object} arr
 * @param {function} iterator
 * @returns {object[]}
 */

function _filter (arr, iterator) {
  var newArr = [];
  for (var i = 0, l = arr.length; i < l; ++i) if (iterator(arr[i])) newArr.push(arr[i]);
  return newArr;
}

module.exports = _filter;
