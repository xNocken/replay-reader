const onNetDeltaRead = require("../../export/onNetDeltaRead");
const NetDeltaSerializeHeader = require("./netDeltaSerializeHeader");
const receiveProperties = require("./receiveProperties");

const NetDeltaSerialize = (reader, group, bunch, enablePropertyChecksum, globalData, mapObjectName) => {
  const header = NetDeltaSerializeHeader(reader);

  if (reader.isError) {
    return false;
  }

  for (let i = 0; i < header.numDeletes; i++) {
    const elementIndex = reader.readInt32();

    globalData.onNetDeltaRead(bunch.chIndex, {
      deleted: true,
      elementIndex,
      path: group.pathName,
    }, bunch.timeSeconds, mapObjectName, globalData);
  }

  for (let i = 0; i < header.numChanged; i++) {
    const elementIndex = reader.readInt32();

    const exportGroup = receiveProperties(reader, group, bunch, !enablePropertyChecksum, true, globalData, mapObjectName);

    if (!exportGroup) {
      continue;
    }

    globalData.onNetDeltaRead(bunch.chIndex, {
      elementIndex,
      export: exportGroup,
    }, bunch.timeSeconds, mapObjectName, globalData);
  }
};

module.exports = NetDeltaSerialize;
