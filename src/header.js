const Header = require('./Classes/Header');
const Replay = require('./Classes/Replay');

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 *
 * @returns {Header} The header
 */
const header = (replay) => {
  const result = new Header();

  result.Magic = replay.readUInt32();
  result.NetworkVersion = replay.readUInt32();
  result.NetworkChecksum = replay.readUInt32();
  result.EngineNetworkVersion = replay.readUInt32();
  result.GameNetworkProtocolVersion = replay.readUInt32();

  if (result.NetworkVersion >= 12) {
    result.Guid = replay.readId();
  }

  if (result.NetworkVersion >= 11) {
    replay.skipBytes(4);
    result.Patch = replay.readUInt16();
    result.Changelist = replay.readUInt32();
    result.Branch = replay.readString();

    const regex = result.Branch.match(/\+\+Fortnite\+Release\-(?<major>\d+)\.(?<minor>\d*)/);

    result.Major = regex.groups.major;
    result.Minor = regex.groups.minor;
  } else {
    result.Changelist = replay.readUInt32();
  }

  if (header.networkVersion <= 6) {
    throw Error('Not implented')
  } else {
    result.LevelNamesAndTimes = replay.readObjectArray((a) => a.readString(), (a) => a.readUInt32())
  }

  if (result.NetworkVersion >= 9) {
    result.Flags = replay.readUInt32();
  }

  result.gameSpecificData = replay.readArray((a) => a.readString());

  replay.header = result;

  return result;
};

module.exports = header;
