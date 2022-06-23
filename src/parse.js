const parseHeader = require('./header');

const replayMagic = 0x1CA2E27F;

const replayInfo = (replay, globalData) => {
  const info = {};

  info.magic = replay.readUInt32();

  if (info.magic !== replayMagic) {
    throw new Error('Not a valid replay');
  }

  info.fileVersion = replay.readUInt32();
  info.lengthInMs = replay.readUInt32();
  info.networkVersion = replay.readUInt32();
  info.changelist = replay.readUInt32();
  info.friendlyName = replay.readString();
  info.isLive = replay.readBoolean();

  if (info.fileVersion >= 3) {
    info.timestamp = replay.readDate();
  }

  if (info.fileVersion >= 2) {
    info.isCompressed = replay.readBoolean();
  }

  if (info.fileVersion >= 6) {
    info.isEncrypted = replay.readBoolean();
    info.encryptionKey = Buffer.from(replay.readBytes(replay.readUInt32()));
  }

  if (!info.isLive && info.isEncrypted && info.encryptionKey.length === 0) {
    throw Error('Replay encrypted but no key was found!');
  }

  if (info.isLive && info.isEncrypted) {
    throw Error('Replay encrypted but not completed');
  }

  replay.info = info;
  globalData.info = info;

  return info;
};

const replayChunks = (replay, globalData) => {
  const chunks = {
    replayData: [],
    checkpoints: [],
    events: [],
  };

  while (replay.lastBit > replay.offset) {
    const chunkType = replay.readUInt32();
    const chunkSize = replay.readInt32();

    replay.addOffsetByte(0, chunkSize);

    switch (chunkType) {
      case 0:
        globalData.header = parseHeader(replay);
        break;

      case 1: {
        let info = {};

        if (replay.info.fileVersion >= 4) {
          info.start = replay.readUInt32();
          info.end = replay.readUInt32();
          info.length = replay.readUInt32();
        } else {
          info.length = replay.readUInt32();
        }

        if (replay.info.fileVersion >= 6) {
          replay.skipBytes(4);
        }

        info.startPos = replay.offset;
        chunks.replayData.push(info);
        break;
      }


      case 2: {
        const info = {
          id: replay.readString(),
          group: replay.readString(),
          metadata: replay.readString(),
          start: replay.readUInt32(),
          end: replay.readUInt32(),
          sizeInBytes: replay.readUInt32(),
          startPos: replay.offset,
        };

        chunks.checkpoints.push(info);
        break;
      }

      case 3: {
        const info = {
          eventId: replay.readString(),
          group: replay.readString(),
          metadata: replay.readString(),
          startTime: replay.readUInt32(),
          endtime: replay.readUInt32(),
          length: replay.readUInt32(),
          startPos: replay.offset,
        };

        chunks.events.push(info);
        break;
      }

      default:
        console.warn('Unhandled chunkType:', chunkType);
    }

    replay.popOffset(0);
  }

  return chunks;
};

module.exports = {
  replayInfo,
  replayChunks,
};
