const decompress = require('./decompress');
const Replay = require('./Classes/Replay');
const parsePlaybackPackets = require('./replayData/parsePlaybackPackets');


/**
 * Parse the replayData event
 * @param {Replay} replay the replay
 */
const parseReplayData = (replay, data, globalData) => {
  replay.goTo(data.startPos);
  const decrypted = replay.decryptBuffer(data.length);
  const binaryReplay = decompress(decrypted, replay.info.isCompressed, globalData);

  while (!binaryReplay.atEnd()) {
    parsePlaybackPackets(binaryReplay, globalData);
  }

  if (!replay.info.isEncrypted) {
    replay.popOffset(1);
  };
}

module.exports = parseReplayData;
