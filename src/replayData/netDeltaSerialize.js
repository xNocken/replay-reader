const onNetDeltaRead = require("./export/onNetDeltaRead");
const NetDeltaSerializeHeader = require("./netDeltaSerializeHeader");
const receiveProperties = require("./recieveProperties");

const NetDeltaSerialize = (reader, group, bunch, enablePropertyChecksum, globalData) => {
  const header = NetDeltaSerializeHeader(reader);

  if (reader.isError) {
    return false;
  }

  for (let i = 0; i < header.numDeletes; i++) {
    const elementIndex = reader.readInt32();

    if (globalData.onNetDeltaRead) {
      globalData.onNetDeltaRead(bunch.chIndex, {
        deleted: true,
        elementIndex,
      });
    } else {
      onNetDeltaRead(bunch.chIndex, {
        deleted: true,
        elementIndex,
      }, bunch.timeSeconds, globalData);
    }
  }

  for (let i = 0; i < header.numChanged; i++) {
    const elementIndex = reader.readInt32();

    const exportGroup = receiveProperties(reader, group, bunch, !enablePropertyChecksum, true, globalData);

    if (globalData.onNetDeltaRead) {
      globalData.onNetDeltaRead(bunch.chIndex, {
        elementIndex,
        export: exportGroup,
      });
    } else {
      onNetDeltaRead(bunch.chIndex, {
        elementIndex,
        export: exportGroup,
      }, bunch.timeSeconds, globalData);
    }
  }
};

module.exports = NetDeltaSerialize;
