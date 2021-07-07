const Replay = require('../Classes/Replay');
const internalLoadObject = require('./internalLoadObject');
const receiveNetFieldExportsCompat = require('./receiveNetFieldExportsCompat');

/**
 * @param {Replay} packet
 */
const receiveNetGUIDBunch = (packet, globalData) => {
  const bHasRepLayoutExport = packet.readBit();

  if (bHasRepLayoutExport) {
    receiveNetFieldExportsCompat(packet, globalData);
    return;
  }

  const numGUIDsInBunch = packet.readInt32();
  const MAX_GUID_COUNT = 2048;

  if (numGUIDsInBunch > MAX_GUID_COUNT) {
    return;
  }

  let numGUIDSRead = 0;

  while (numGUIDSRead < numGUIDsInBunch) {
    internalLoadObject(packet, true, globalData);
    numGUIDSRead++;
  }
};

module.exports = receiveNetGUIDBunch;
