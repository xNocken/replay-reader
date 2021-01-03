const NetBitReader = require("../Classes/NetBitReader");
const Replay = require("../Classes/Replay");
const internalLoadObject = require("./internalLoadObject");

/**
 * same as above
 * @param {Replay} replay the replay
 */
const readNetExportGuids = (replay) => {
  const numGuids = replay.readIntPacked();

  for (let i = 0; i < numGuids; i++) {
    const size = replay.readInt32();
    const reader = new NetBitReader(replay.readBytes(size));

    internalLoadObject(reader, true);
  }
}


module.exports = readNetExportGuids;
