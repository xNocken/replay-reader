/**
 *
 * @param {String} path
 *
 * @returns {String}
 */

const removePathPrefix = (path, toRemove = '') => {
  if (toRemove !== '') {
    if (toRemove.length > path.length) {
      return path;
    }

    for (var i = 0; i < toRemove.length; i++) {
      if (path[i] != toRemove[i]) {
        return path;
      }
    }

    return path.substring(toRemove.length);
  }

  for (var i = path.length - 1; i >= 0; i--) {
    switch (path[i]) {
      case '.':
        return path.substring(i + 1);
      case '/':
        return path;
    }
  }

  return removePathPrefix(path, 'Default__');
}

module.exports = removePathPrefix;
