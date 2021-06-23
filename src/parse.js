const Info = require('./Classes/Info');
const Replay = require('./Classes/Replay');
const event = require('./event');
const parseHeader = require('./header');
const parseReplayData = require('./replayData');
const GlobalData = require('./utils/globalData');

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 *
 * @returns {Info} Informations about the replay
 */
const replayInfo = (replay) => {
  const info = new Info();

  info.Magic = replay.readUInt32();
  info.FileVersion = replay.readUInt32();
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
    throw new Error('Replay encrypted but no key was found!');
  }

  if (info.IsLive && info.IsEncrypted) {
    throw new Error('Replay encrypted but not completed');
  }

  replay.info = info;

  return info;
};

/**
* Parse the replays meta
* @param {Replay} replay the replay
* @param {GlobalData} globalData globals
*/
const replayChunks = async (replay, globalData) => {
  const events = [];
  let lastOffset = 0;
  let lastTime = Date.now();

  while (replay.lastBit > replay.offset) {
    if (globalData.debug) {
      console.log((((replay.offset - lastOffset) / ((Date.now() - lastTime) / 1000)) / 8).toFixed(0) + ' bytes/s')
      console.log(100 - ((replay.lastBit - replay.offset) / replay.lastBit * 100));
      lastOffset = replay.offset;
      lastTime = Date.now();
    }

    const chunkType = replay.readUInt32();
    const chunkSize = replay.readInt32();

    replay.addOffsetByte(chunkSize);

    switch (chunkType) {
      case 0:
        globalData.header = parseHeader(replay);
        break;

      case 1:
        await parseReplayData(replay, globalData);
        break;

      case 2:
        // TODO: handle checkpoints later
        break;

      case 3:
        events.push(event(replay));
        break;

      default:
        console.warn('Unhandled chunkType:', chunkType);
    }

    replay.popOffset();
  }

  return events;
}

module.exports = {
  replayInfo,
  replayChunks,
};
