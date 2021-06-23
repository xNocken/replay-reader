const PlaybackPacket = require('../Classes/PlaybackPacket');
const Replay = require('../Classes/Replay');

/**
 * @param {Replay} replay
 */
const readPacket = (replay) => {
  const packet = new PlaybackPacket();

  const bufferSize = replay.readInt32();
  packet.size = bufferSize;

  if (bufferSize === 0) {
    packet.state = 1;

    return packet;
  } else if(bufferSize > 2048) {
    packet.state = 2;

    return packet;
  } else if (bufferSize < 0) {
    packet.state = 2;

    return packet;
  }

  packet.state = 0;

  return packet;
}

module.exports = readPacket;
