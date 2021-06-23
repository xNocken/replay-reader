const receiveProperties = require("./recieveProperties");

const receivedRPC = (reader, group, bunch, globalData) => {
  receiveProperties(reader, group, bunch, true, false, globalData);

  if (!globalData.channels[bunch.chIndex].isIgnoringChannel(group.pathName) && globalData.netFieldParser.willReadType(group.pathName) && !reader.atEnd()) {
    return false;
  }

  return true;
};

module.exports = receivedRPC;
