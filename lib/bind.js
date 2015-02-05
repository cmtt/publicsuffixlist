var __slice = [].slice;

/**
 * @param  {function} fn
 * @param  {*} boundTo
 * @return {function}
 */

module.exports = function (fn, boundTo) {
  var boundArgs = __slice.apply(arguments).slice(2);
  return function () { fn.apply(boundTo, boundArgs.concat(__slice.apply(arguments))); };
};
