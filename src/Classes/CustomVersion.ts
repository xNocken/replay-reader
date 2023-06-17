import ECustomVersionSerializationFormat from '../versions/ECustomVersionSerializationFormat';
import EEngineNetworkCustomVersion from '../versions/EEngineNetworkCustomVersion';
import ELocalFileReplayCustomVersion from '../versions/ELocalFileReplayCustomVersion';
import EReplayCustomVersion from '../versions/EReplayCustomVersion';
import Replay from './Replay';

export default class CustomVersion {
  versions: Record<string, number> = {};

  serialize(replay: Replay, format: ECustomVersionSerializationFormat = ECustomVersionSerializationFormat.Latest) {
    switch (format) {
      case ECustomVersionSerializationFormat.Optimized:
        const versions = replay.readArray((theReplay) => ({
          guid: theReplay.readGuid(),
          version: theReplay.readUInt32(),
        }));

        versions.forEach((version) => {
          this.versions[version.guid] = version.version;
        });

        break;

      case ECustomVersionSerializationFormat.Guids:
        throw new Error('Not implemented');

      case ECustomVersionSerializationFormat.Enums:
        throw new Error('Not implemented');

      default:
        throw new Error(`Unknown custom version serialization format ${format}`);
    }
  }

  getLocalFileReplayVersion(): ELocalFileReplayCustomVersion {
    return this.versions['95a4f03e-7e0b-49e4-ba43-d35694ff87d9'];
  }

  setLocalFileReplayVersion(version: number) {
    this.versions['95a4f03e-7e0b-49e4-ba43-d35694ff87d9'] = version;
  }

  getNetworkVersion(): EReplayCustomVersion {
    return this.versions['8417998a-bbc0-43ec-81b3-d119072d2722'];
  }

  setNetworkVersion(version: number) {
    this.versions['8417998a-bbc0-43ec-81b3-d119072d2722'] = version;
  }

  getEngineNetworkVersion(): EEngineNetworkCustomVersion {
    return this.versions['62915ca3-1c8e-4bf7-a30e-12c7c8219df7'];
  }

  setEngineNetworkVersion(version: number) {
    this.versions['62915ca3-1c8e-4bf7-a30e-12c7c8219df7'] = version;
  }

  getGameNetworkVersion() {
    return this.versions['cc400d24-e0e9-4e7b-9bf9-a283dcc0c027'];
  }

  setGameNetworkVersion(version: number) {
    this.versions['cc400d24-e0e9-4e7b-9bf9-a283dcc0c027'] = version;
  }
}
