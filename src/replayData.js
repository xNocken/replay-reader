const decompress = require('./decompress');
const Replay = require('./Classes/Replay');
const parsePlaybackPackets = require('./replayData/parsePlaybackPackets');


/**
 * Parse the replayData event
 * @param {Replay} replay the replay
 */
const parseReplayData = async (replay, data, globalData) => {
  replay.goTo(data.startPos);
  const decrypted = replay.decryptBuffer(data.length);
  const binaryReplay = await decompress(decrypted, replay.info.IsCompressed);

  while (!binaryReplay.atEnd()) {
    parsePlaybackPackets(binaryReplay, globalData);
  }

  if (!replay.info.IsEncrypted) {
    replay.popOffset(1);
  };
}

module.exports = parseReplayData;
