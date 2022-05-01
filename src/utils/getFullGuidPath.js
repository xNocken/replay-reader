const getFullGuidPath = (guid) => {
  if (!guid) {
    return null;
  }

  if (guid.outer) {
    return `${getFullGuidPath(guid.outer)}.${guid.path}`;
  }

  return guid.path;
};

module.exports = getFullGuidPath;
