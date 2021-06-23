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

    replay.addOffsetByte(size);

    internalLoadObject(replay, true);

    replay.popOffset();
  }
}


module.exports = readNetExportGuids;
