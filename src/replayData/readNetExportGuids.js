const internalLoadObject = require("./internalLoadObject");

const readNetExportGuids = (replay, globalData) => {
  const numGuids = replay.readIntPacked();

  for (let i = 0; i < numGuids; i++) {
    const size = replay.readInt32();

    replay.addOffsetByte(2, size);

    internalLoadObject(replay, true, globalData);

    replay.popOffset(2);
  }
};


module.exports = readNetExportGuids;
