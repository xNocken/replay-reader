const Header = require('./Classes/Header');
const Replay = require('./Classes/Replay');

const headerMagic = 0x2CF5A13D;

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 *
 * @returns {Header} The header
 */
const header = (replay) => {
  const result = new Header();

  result.magic = replay.readUInt32();

  if (result.magic !== headerMagic) {
    throw new Error('Not a valid replay');
  }

  result.networkVersion = replay.readUInt32();
  result.networkChecksum = replay.readUInt32();
  result.engineNetworkVersion = replay.readUInt32();
  result.gameNetworkProtocolVersion = replay.readUInt32();

  if (result.networkVersion >= 12) {
    result.guid = replay.readId();
  }

  if (result.networkVersion >= 11) {
    replay.skipBytes(4);
    result.patch = replay.readUInt16();
    result.changelist = replay.readUInt32();
    result.branch = replay.readString();

    const regex = result.branch.match(/\+\+Fortnite\+Release\-(?<major>\d+)\.(?<minor>\d*)/);

    if (regex) {
      result.major = regex.groups.major;
      result.minor = regex.groups.minor;
    }
  } else {
    result.changelist = replay.readUInt32();
  }

  if (result.networkVersion <= 6) {
    throw Error('Not implented')
  } else {
    result.levelNamesAndTimes = replay.readObjectArray((a) => a.readString(), (a) => a.readUInt32())
  }

  if (result.networkVersion >= 9) {
    result.flags = replay.readUInt32();
  }

  result.gameSpecificData = replay.readArray((a) => a.readString());

  if (result.engineNetworkVersion === 9) {
    throw new Error('Replays with engineNetworkVersion 9 are not supported');
  }

  if (result.networkVersion >= 17) {
    replay.skipBytes(16)

    result.platform = replay.readString();
    replay.skipBytes(2)
  }

  replay.header = result;

  return result;
};

module.exports = header;
