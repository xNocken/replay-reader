import { receiveCustomProperty } from './receive-custom-property';
import { receiveProperties } from '../receive-properties';
import { netDeltaSerialize } from './net-delta-serialize';
import { readFieldHeader } from './read-field-header';
import { Bunch, Data } from '../../../../types/lib';
import Replay from '../../../Classes/Replay';
import { NetFieldExportGroupInternal } from '../../../../types/nfe';
import GlobalData from '../../../Classes/GlobalData';
import { readFunction } from './read-function';

export const readClassNetCache = (
  archive: Replay,
  bunch: Bunch,
  staticActorId: string,
  classNetCache: NetFieldExportGroupInternal,
  globalData: GlobalData,
) => {
  while (true) {
    const result = readFieldHeader(archive, classNetCache);

    if (!result) {
      break;
    }

    const { outField: fieldCache, numPayloadBits } = result;

    if (!fieldCache || fieldCache.incompatible) {
      archive.skipBits(numPayloadBits);

      continue;
    }

    archive.addOffset(5, numPayloadBits);

    if (fieldCache.parseType === 'function') {
      readFunction(
        archive,
        bunch,
        numPayloadBits,
        staticActorId,
        fieldCache,
        classNetCache,
        globalData,
      );
    }

    if (fieldCache.parseType === 'class') {
      receiveCustomProperty(
        archive,
        fieldCache,
        bunch,
        globalData,
        staticActorId,
      );
    }

    if (fieldCache.parseType === 'netDeltaSerialize') {
      const exportGroup = globalData.netGuidCache.getNFEReference(
        fieldCache.type,
      );

      if (!exportGroup) {
        archive.popOffset(5);

        globalData.logger.warn(`class net cache ${fieldCache.name} from ${classNetCache.pathName} has been declared but has no export group`);

        continue;
      }

      if (!globalData.netFieldParser.willReadType(exportGroup.pathName)) {
        archive.popOffset(5);

        continue;
      }

      if (
        netDeltaSerialize(
          archive,
          exportGroup,
          bunch,
          fieldCache.enablePropertyChecksum || false,
          globalData,
          staticActorId,
        )
      ) {
        archive.popOffset(5);

        continue;
      }
    }

    archive.popOffset(5);
  }
};