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

    const netGuid = replay.readIntPacked();

    const externalDataNumBytes = (externalDataNumBits + 7) >> 3;
    replay.skip(externalDataNumBytes);
  }
};

module.exports = readExternalData;
