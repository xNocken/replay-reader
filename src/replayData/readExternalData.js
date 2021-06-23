const Replay = require("../Classes/Replay");

/**
 * @param {Replay} replay
 */
const readExternalData = (replay) => {
  while(true) {
    const externalDataNumBits = replay.readIntPacked();

    if (!externalDataNumBits) {
      return;
    }

    replay.readIntPacked();

    const externalDataNumBytes = externalDataNumBits  / 8;
    replay.skipBytes(externalDataNumBytes);
  }
};

module.exports = readExternalData;
