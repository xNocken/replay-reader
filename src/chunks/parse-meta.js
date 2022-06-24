const metaMagic = 0x1CA2E27F;

const parseMeta = (replay, globalData) => {
  const info = {};

  info.magic = replay.readUInt32();

  if (info.magic !== metaMagic) {
    throw new Error('Not a valid replay');
  }

  info.fileVersion = replay.readUInt32();
  info.lengthInMs = replay.readUInt32();
  info.networkVersion = replay.readUInt32();
  info.changelist = replay.readUInt32();
  info.friendlyName = replay.readString();
  info.isLive = replay.readBoolean();

  if (info.fileVersion >= 3) {
    info.timestamp = replay.readDate();
  }

  if (info.fileVersion >= 2) {
    info.isCompressed = replay.readBoolean();
  }

  if (info.fileVersion >= 6) {
    info.isEncrypted = replay.readBoolean();
    info.encryptionKey = Buffer.from(replay.readBytes(replay.readUInt32()));
  }

  if (!info.isLive && info.isEncrypted && info.encryptionKey.length === 0) {
    throw Error('Replay encrypted but no key was found!');
  }

  if (info.isLive && info.isEncrypted) {
    throw Error('Replay encrypted but not completed');
  }

  replay.info = info;
  globalData.info = info;

  return info;
};

module.exports = parseMeta;
