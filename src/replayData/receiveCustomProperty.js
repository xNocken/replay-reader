const netGuidCache = require("../utils/netGuidCache");
const onExportRead = require("./export/onExportRead");

const receiveCustomProperty = (reader, fieldCache, chIndex, pathName, globalData) => {
  const theClass = require(`../../Classes/${fieldCache.type}.js`);
  const dingens = new theClass();
  dingens.serialize(reader);

  if (dingens.resolve) {
    dingens.resolve(netGuidCache);
  }

  dingens.type = fieldCache.customExportName || pathName.split('/').pop();

  if (globalData.onExportRead) {
    globalData.onExportRead(chIndex, dingens, 0, globalData);
  } else {
    onExportRead(chIndex, dingens, 0, globalData); // TODO: time seconds
  }
}

module.exports = receiveCustomProperty;
