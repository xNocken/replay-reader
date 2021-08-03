const Replay = require("../Classes/Replay");
const GlobalData = require("../utils/globalData");

/**
 * @param {Replay} replay
 * @param {GlobalData} globalData
 */
const readExternalData = (replay, globalData) => {
  while(true) {
    const externalDataNumBits = replay.readIntPacked();

    if (!externalDataNumBits) {
      return;
    }

    const netGuid = replay.readIntPacked();
    const externalDataNumBytes = externalDataNumBits  / 8;

    const handle = replay.readByte();
    const something1 = replay.readByte();
    const something2 = replay.readByte(); // 0 = botname, 1 = playername

    const externalData = {
      netGuid,
      externalDataNumBits,
      handle,
      something1,
      something2,
      payload: replay.readBytes(externalDataNumBytes - 3)
    };

    globalData.externalData[netGuid] = externalData;
  }
};

module.exports = readExternalData;
