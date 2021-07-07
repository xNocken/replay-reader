const netGuidCache = require("../utils/netGuidCache");
const onExportRead = require("../../export/onExportRead");

const receiveCustomProperty = (reader, fieldCache, bunch, pathName, globalData) => {
  const theClass = require(`../../Classes/${fieldCache.type}.js`);
  const dingens = new theClass();
  dingens.serialize(reader);

  if (dingens.resolve) {
    dingens.resolve(netGuidCache);
  }

  dingens.type = fieldCache.customExportName || pathName.split('/').pop();

  if (globalData.onExportRead) {
    globalData.onExportRead(bunch.chIndex, dingens, bunch.timeSeconds, '', globalData);
  } else {
    onExportRead(bunch.chIndex, dingens, bunch.timeSeconds, '', globalData);
  }
}

module.exports = receiveCustomProperty;
