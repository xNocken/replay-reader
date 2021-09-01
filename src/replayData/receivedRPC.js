const receiveProperties = require("./receiveProperties");

const receivedRPC = (reader, group, bunch, globalData, staticActorId) => {
  receiveProperties(reader, group, bunch, true, false, globalData, staticActorId);

  if (!reader.atEnd()) {
    return false;
  }

  return true;
};

module.exports = receivedRPC;
