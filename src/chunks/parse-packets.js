const decompress = require('../utils/decompress');
const parsePlaybackPackets = require('./packets/parse-playback-packets');


const parsePackets = (replay, data, globalData) => {
  replay.goTo(data.startPos);
  const decrypted = replay.decryptBuffer(data.length);
  const binaryReplay = decompress(decrypted, replay.info.isCompressed, globalData);

  while (!binaryReplay.atEnd()) {
    parsePlaybackPackets(binaryReplay, globalData);
  }

  if (!replay.info.isEncrypted) {
    replay.popOffset(1);
  };
};

module.exports = parsePackets;
