import { Header, ReadObjectResult } from '../../types/lib';
import { Logger } from '../Classes/Logger';
import Replay from '../Classes/Replay';
import versions from '../constants/versions';

const headerMagic = 0x2CF5A13D;

const header = (replay: Replay, logger: Logger): Header => {
  const magic = replay.readUInt32();

  if (magic !== headerMagic) {
    throw new Error('Not a valid replay');
  }

  const networkVersion = replay.readUInt32();
  const networkChecksum = replay.readUInt32();
  const engineNetworkVersion = replay.readUInt32();
  const gameNetworkProtocolVersion = replay.readUInt32();
  let levelNamesAndTimes: ReadObjectResult<number>;
  let guid: string;
  let minor: number;
  let changelist: number;
  let branch: string;
  let major: number;
  let patch: number;
  let flags: number;
  let platform: string;
  let fileVersionUE4: number;
  let fileVersionUE5: number;
  let packageVersionLicenseeUe: number;

  if (networkVersion > versions.networkVersion) {
    logger.warn('This replay has a higher network version than currently supported. parsing may fail');
  }

  if (engineNetworkVersion > versions.engineNetworkVersion) {
    logger.warn('This replay has a higher engine network version than currently supported. parsing may fail');
  }

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

  if (networkVersion >= 18) {
    fileVersionUE4 = replay.readUInt32();
    fileVersionUE5 = replay.readUInt32();
    packageVersionLicenseeUe = replay.readUInt32();
  }

  if (networkVersion <= 6) {
    throw Error('Not implented');
  } else {
    levelNamesAndTimes = replay.readObject((replay) => replay.readString(), (replay) => replay.readUInt32());
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
    fileVersionUE4,
    fileVersionUE5,
    packageVersionLicenseeUe,
  };

  replay.header = result;

  return result;
};

export default header;
