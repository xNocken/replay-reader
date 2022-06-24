const internalLoadObject = require('../../utils/read-net-guid');
const receiveNetFieldExportsCompat = require('./receive-net-field-exports-compat');

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

  for (let i = 0; i < numGUIDsInBunch; i += 1) {
    internalLoadObject(packet, true, globalData);
  }
};

module.exports = receiveNetGUIDBunch;
