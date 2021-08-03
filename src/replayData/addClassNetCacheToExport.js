const createRebuidExport = require("./createRebuildExport");

const addClassNetCacheToExport = (bunch, properties, exports, pathName, globalData) => {
  if (!globalData.result.packets[bunch.timeSeconds]
    || !globalData.result.packets[bunch.timeSeconds][bunch.chIndex]
    || !globalData.result.packets[bunch.timeSeconds][bunch.chIndex][bunch.chSequence]) {
    createRebuidExport(bunch, exports, globalData);
  }

  const currentExport = globalData.result.packets[bunch.timeSeconds][bunch.chIndex][bunch.chSequence].exports.slice(-1)[0];

  currentExport.classNetCacheProperties = properties;
  currentExport.classNetCachePathName = pathName;
};

module.exports = addClassNetCacheToExport;
