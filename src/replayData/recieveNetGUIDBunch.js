const NetBitReader = require('../Classes/NetBitReader');
const internalLoadObject = require('./internalLoadObject');

/**
 * @param {NetBitReader} packet
 */
const recieveNetGUIDBunch = (packet) => {
  const bHasRepLayoutExport = packet.readBit();

  if (bHasRepLayoutExport) {
    receiveNetFieldExportsCompat(packet);
    return;
  }

  const numGUIDsInBunch = packet.readInt32();
  const MAX_GUID_COUNT = 2048;

  if (numGUIDsInBunch > MAX_GUID_COUNT) {
    return;
  }

  let numGUIDSRead = 0;

  while (numGUIDSRead < numGUIDsInBunch) {
    internalLoadObject(packet, true);
    numGUIDSRead++;
  }
};

module.exports = recieveNetGUIDBunch;
