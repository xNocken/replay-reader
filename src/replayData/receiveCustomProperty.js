const { netFieldParser } = require("../utils/globalData");
const netGuidCache = require("../utils/netGuidCache");
const onExportRead = require("./export/onExportRead");

const receiveCustomProperty = (reader, fieldCache, chIndex, pathName) => {
  const theClass = require(`../../Classes/${fieldCache.type}.js`);
  const dingens = new theClass();
  dingens.serialize(reader);

  if (dingens.resolve) {
    dingens.resolve(netGuidCache);
  }

  dingens.type = pathName.split('/').pop();

  onExportRead(chIndex, dingens);
}

module.exports = receiveCustomProperty;
