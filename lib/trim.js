/**
 * @function
 * @param {string} str
 * @returns {string} str
 */

function _trim (str) { return str.replace(/^\s+|\s+$/g, ''); }
module.exports = _trim;
