const receiveProperties = require("./receiveProperties");

const receivedRPC = (reader, group, bunch, globalData, mapObjectName) => {
  receiveProperties(reader, group, bunch, true, false, globalData, mapObjectName);

  if (!globalData.channels[bunch.chIndex].isIgnoringChannel(group.pathName) && globalData.netFieldParser.willReadType(group.pathName) && !reader.atEnd()) {
    return false;
  }

  return true;
};

module.exports = receivedRPC;
