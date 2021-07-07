const NetDeltaSerialize = require("./netDeltaSerialize");

const receiveCustomDeltaProperty = (reader, group, bunch, enablePropertyChecksum, globalData, mapObjectName) => {
  if (reader.header.EngineNetworkVersion >= 11) {
    reader.readBit();
  }

  return NetDeltaSerialize(reader, group, bunch, enablePropertyChecksum, globalData, mapObjectName);
};

module.exports = receiveCustomDeltaProperty;
