/**
 *
 * @param {String} path
 *
 * @returns {String}
 */

const removePathPrefix = (path, toRemove = '') => {
  if (toRemove !== '') {
    if (toRemove.Length > path.Length) {
      return path;
    }

    for (var i = 0; i < toRemove.Length; i++) {
      if (path[i] != toRemove[i]) {
        return path;
      }
    }

    return path.substring(toRemove.Length);
  }

  for (var i = path.Length - 1; i >= 0; i--) {
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
