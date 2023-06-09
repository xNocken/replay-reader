const Info = require('./Classes/Info');
const Replay = require('./Classes/Replay');
const parseHeader = require('./header');
const GlobalData = require('./utils/globalData');

const replayMagic = 0x1CA2E27F;

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 *
 * @returns {Info} Informations about the replay
 */
const replayInfo = (replay, globalData) => {
  const info = new Info();

  info.Magic = replay.readUInt32();

  if (info.Magic !== replayMagic) {
    throw new Error('Not a valid replay');
  }

  info.FileVersion = replay.readUInt32();

  // dont want to properly implement this so just skip it lol
  if (info.FileVersion >= 7) {
    const customVersionCount = replay.readInt32();

    // version guid -> 16 bytes
    // version -> 4 bytes
    replay.skipBytes(customVersionCount * 20);
  }

  info.LengthInMs = replay.readUInt32();
  info.NetworkVersion = replay.readUInt32();
  info.Changelist = replay.readUInt32();
  info.FriendlyName = replay.readString();
  info.IsLive = replay.readBoolean();

  if (info.FileVersion >= 3) {
    info.Timestamp = new Date(parseInt((replay.readUInt64() - BigInt('621355968000000000')) / BigInt('10000'), 10));
  }

  if (info.FileVersion >= 2) {
    info.IsCompressed = replay.readBoolean();
  }

  if (info.FileVersion >= 6) {
    info.IsEncrypted = replay.readBoolean();
    info.EncryptionKey = replay.readBytes(replay.readUInt32());
  }

  if (!info.IsLive && info.IsEncrypted && info.EncryptionKey.length === 0) {
    throw Error('Replay encrypted but no key was found!');
  }

  if (info.IsLive && info.IsEncrypted) {
    throw Error('Replay encrypted but not completed');
  }

  replay.info = info;
  globalData.info = info;

  return info;
};

/**
* Parse the replays meta
* @param {Replay} replay the replay
* @param {GlobalData} globalData globals
*/
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

        if (replay.info.FileVersion >= 4) {
          info.start = replay.readUInt32();
          info.end = replay.readUInt32();
          info.length = replay.readUInt32();
        } else {
          info.length = replay.readUInt32();
        }

        if (replay.info.FileVersion >= 6) {
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
}

module.exports = {
  replayInfo,
  replayChunks,
};
