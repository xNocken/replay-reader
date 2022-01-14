const NetDeltaSerialize = require("./netDeltaSerialize");

const receiveCustomDeltaProperty = (reader, group, bunch, enablePropertyChecksum, globalData, staticActorId) => {
  if (reader.header.engineNetworkVersion >= 11) {
    reader.readBit();
  }

  return NetDeltaSerialize(reader, group, bunch, enablePropertyChecksum, globalData, staticActorId);
};

module.exports = receiveCustomDeltaProperty;
