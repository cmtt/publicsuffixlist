module.exports = function(str, characters) {
  // rtrim taken from Underscore.string, (c) 2011 Esa-Matti Suurone under MIT License
  // https://github.com/epeli/underscore.string
  characters = characters.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
  return str.replace(new RegExp('[' + characters + ']+$', 'g'), '');
};
