import { Header, ReadObjectResult } from '$types/lib';
import Replay from '../Classes/Replay';

const headerMagic = 0x2CF5A13D;

const header = (replay: Replay): Header => {
  const magic = replay.readUInt32();

  if (magic !== headerMagic) {
    throw new Error('Not a valid replay');
  }

  const networkVersion = replay.readUInt32();
  const networkChecksum = replay.readUInt32();
  const engineNetworkVersion = replay.readUInt32();
  const gameNetworkProtocolVersion = replay.readUInt32();
  let levelNamesAndTimes: ReadObjectResult;
  let guid: string;
  let minor: number;
  let changelist: number;
  let branch: string;
  let major: number;
  let patch: number;
  let flags: number;
  let platform: string;

  if (networkVersion >= 12) {
    guid = replay.readId();
  }

  if (networkVersion >= 11) {
    replay.skipBytes(4);
    patch = replay.readUInt16();
    changelist = replay.readUInt32();
    branch = replay.readString();

    const regex = branch.match(/\+\+Fortnite\+Release-(?<major>\d+)\.(?<minor>\d*)/);

    if (regex) {
      major = parseInt(regex.groups.major, 10);
      minor = parseInt(regex.groups.minor, 10);
    }
  } else {
    changelist = replay.readUInt32();
  }

  if (networkVersion <= 6) {
    throw Error('Not implented');
  } else {
    levelNamesAndTimes = replay.readObjectArray((replay) => replay.readString(), (replay) => replay.readUInt32());
  }

  if (networkVersion >= 9) {
    flags = replay.readUInt32();
  }

  const gameSpecificDataAmount = replay.readUInt32();
  const gameSpecificData = [];

  for (let i = 0; i < gameSpecificDataAmount; i++) {
    gameSpecificData.push(replay.readString());
  }

  if (engineNetworkVersion === 9) {
    throw new Error('Replays with engineNetworkVersion 9 are not supported');
  }

  if (networkVersion >= 17) {
    replay.skipBytes(16);

    platform = replay.readString();
    replay.skipBytes(2);
  }

  const result: Header = {
    networkVersion,
    networkChecksum,
    engineNetworkVersion,
    gameNetworkProtocolVersion,
    levelNamesAndTimes,
    guid,
    minor,
    changelist,
    branch,
    major,
    patch,
    flags,
    platform,
  };

  replay.header = result;

  return result;
};

export default header;
