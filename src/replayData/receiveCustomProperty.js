const receiveCustomProperty = (reader, fieldCache, bunch, pathName, globalData) => {
  const theClass = require(`../../Classes/${fieldCache.type}.js`);
  const dingens = new theClass();
  dingens.serialize(reader);

  if (dingens.resolve) {
    dingens.resolve(globalData.netGuidCache);
  }

  dingens.type = fieldCache.customExportName || pathName.split('/').pop();

  globalData.exportEmitter.emit(dingens.type, bunch.chIndex, dingens, bunch.timeSeconds, '', globalData);
}

module.exports = receiveCustomProperty;
