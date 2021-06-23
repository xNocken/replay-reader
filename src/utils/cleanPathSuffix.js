/**
 * @param {string} path
 */
const cleanPathSuffix = (path) => {
  for (var i = path.length - 1; i >= 0; i--) {
    if (!path[i].match(/\d/) && path[i] != '_') {
      return path.substring(0, i + 1);
    }
  }

  return path;
}

module.exports = cleanPathSuffix;
