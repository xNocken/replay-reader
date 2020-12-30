const { writeFileSync } = require('fs');
const Replay = require('./Classes/Replay');
const decompress = require('./decompress');
let num = 0;

/**
 * I hope i find out what it does, when its finished
 * @param {Replay} replay the replay
 */
const readNetFieldExports = (replay) => {
  const numLayoutCmdExports = replay.readIntPacked();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    const pathNameIndex = replay.readIntPacked();
    const isExported = replay.readIntPacked() === 1;
    let group;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = replay.readIntPacked();

      // console.log(pathname);
    }
  }
}

/**
 * Read the export data :D
 * @param {Replay} replay the replay
 */
const readExportData = (replay) => {
  readNetFieldExports(replay);
};

/**
 * Get packets from the replay
 * @param {Replay} replay the replay
 */
const parsePlaybackPackets = (replay) => {
  let currentLevelIndex;

  if (replay.header.NetworkVersion >= 6) {
    currentLevelIndex = replay.readInt32()
  }

  const timeSeconds = replay.readFloat32();

  if (replay.header.NetworkVersion >= 10) {
    readExportData(replay);
  }

  if (replay.hasLevelStreamingFixes()) {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
    }
  }
}

/**
 * Parse the replayData event
 * @param {Replay} replay the replay
 */
const parseReplayData = (replay) => {
  let start;
  let end;
  let length;

  if (replay.info.FileVersion >= 4) {
    start = replay.readUInt32();
    end = replay.readUInt32();
    length = replay.readUInt32();
  } else {
    length = replay.readUInt32();
  }

  let memorySizeInBytes = length;

  if (replay.info.FileVersion >= 6) {
    memorySizeInBytes = replay.readInt32();
  }

  const decrypted = replay.decryptBuffer(length);
  decompress(decrypted, replay.info.IsCompressed).then((decompressed) => {
    const newLength = length;
    const binaryReplay = new Replay(decompressed);

    binaryReplay.header = replay.header;
    binaryReplay.info = replay.info;

    while (binaryReplay.buffer.length > binaryReplay.offset) {
      const playbackPackets = parsePlaybackPackets(binaryReplay);
    }
  });
}

module.exports = parseReplayData;
