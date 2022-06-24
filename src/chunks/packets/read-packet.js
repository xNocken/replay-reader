const readPacket = (replay) => {
  const packet = {};

  if (replay.hasLevelStreamingFixes()) {
    packet.streamingFix = replay.readIntPacked();
  }

  const bufferSize = replay.readInt32();

  packet.size = bufferSize;

  if (bufferSize === 0) {
    packet.state = 1;

    return packet;
  }

  if (bufferSize > 2048 || bufferSize < 0) {
    packet.state = 2;

    return packet;
  }

  packet.state = 0;

  return packet;
};

module.exports = readPacket;
