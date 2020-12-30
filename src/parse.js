const Info = require('./Classes/Info');
const Replay = require('./Classes/Replay');
const event = require('./event');
const parseHeader = require('./header');
const parseReplayData = require('./replayData');

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
  info.IsLive = replay.readBool();

  if (info.FileVersion >= 3) {
    info.Timestamp = new Date(parseInt((replay.readUInt64() - BigInt('621355968000000000')) / BigInt('10000'), 10));
  }

  if (info.FileVersion >= 2) {
    info.IsCompressed = replay.readBool();
  }

  if (info.FileVersion >= 6) {
    info.IsEncrypted = replay.readBool();
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
*/
const replayChunks = (replay) => {
  const chunks = [];

  while (replay.buffer.byteLength > replay.offset) {
    const chunkType = replay.readUInt32();
    const chunkSize = replay.readInt32();
    const startOffset = replay.offset;

    switch (chunkType) {
      case 0:
        chunks.push(parseHeader(replay));
        break;

      case 1:
        chunks.push(parseReplayData(replay));
        break;

      case 2:
        // maybe TODO: handle checkpoints later
        break;

      case 3:
        chunks.push(event(replay));
        break;

      default:
        console.warn('Unhandled chunkType:', chunkType);
    }

    replay.offset = startOffset + chunkSize;
  }

  return chunks;
}

module.exports = {
  replayInfo,
  replayChunks,
};
