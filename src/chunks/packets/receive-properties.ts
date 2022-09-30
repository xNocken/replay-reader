import { BaseExport, BaseResult, BaseStates, Bunch, PropertyExport } from '../../../types/lib';
import { NetFieldExportGroupInternal } from '../../../types/nfe';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const receiveProperties = (
  archive: Replay,
  nfeGroup: NetFieldExportGroupInternal,
  bunch: Bunch,
  enableProperyChecksum = true,
  netDeltaUpdate = false,
  globalData: GlobalData,
  staticActorId: string,
) => {
  const { netFieldParser } = globalData;
  const channelIndex = bunch.chIndex;

  if (globalData.options.debug && !netFieldParser.willReadType(nfeGroup.pathName)) {
    return false;
  }

  if (enableProperyChecksum) {
    archive.skipBits(1);
  }

  const exportGroup = netFieldParser.createType(nfeGroup);

  let changedProperties = [];

  while (true) {
    let handle = archive.readIntPacked();

    if (!handle) {
      break;
    }

    handle--;

    const nfe = nfeGroup?.netFieldExports[handle];
    const numbits = archive.readIntPacked();

    if (numbits == 0) {
      continue;
    }

    if (!nfe) {
      archive.skipBits(numbits);

      continue;
    }

    if (nfe.incompatible) {
      archive.skipBits(numbits);

      continue;
    }

    try {
      archive.addOffset(6, numbits);

      let key;

      if ((nfeGroup.parseUnknownHandles && !nfe.parseType) || nfeGroup.storeAsHandle || nfe.storeAsHandle) {
        key = nfe.handle;
      } else {
        key = nfe.exportName;
      }

      changedProperties.push(key);

      const result = netFieldParser.setType(nfe, nfeGroup, archive, globalData);

      if (result === null) {
        nfe.incompatible = true;
      }

      exportGroup[key] = result;
      archive.popOffset(6, numbits, true);
    } catch (ex) {
      globalData.logger.error(ex.stack);
      archive.resolveError(6);
    }
  }

  if (!netDeltaUpdate && changedProperties.length) {
    const actor = bunch.actor;
    const externalData = globalData.externalData[actor.actorNetGUID.value];

    if (externalData) {
      delete globalData.externalData[actor.actorNetGUID.value];
      const nfe = nfeGroup?.netFieldExports[externalData.handle];

      if (nfe) {
        const payloadReader = new Replay(externalData.payload, globalData);

        payloadReader.header = archive.header;

        let key;

        if ((nfeGroup.parseUnknownHandles && !nfe.parseType) || nfeGroup.storeAsHandle || nfe.storeAsHandle) {
          key = nfe.handle;
        } else {
          key = nfe.exportName;
        }

        const result = globalData.netFieldParser.setType(nfe, nfeGroup, payloadReader, globalData);

        if (result === null) {
          nfe.incompatible = true;
        }

        exportGroup[key] = result;
        exportGroup[`${key}_encrypted`] = externalData.isEncrypted;
      }
    }

    if (globalData.options.debug && !globalData.emitters.properties.eventNames().includes(exportGroup.type)) {
      globalData.logger.warn(`Unhandled export ${exportGroup.type}`);
    }

    const exportData: PropertyExport<BaseResult, BaseStates, BaseExport> = {
      chIndex: channelIndex,
      data: exportGroup,
      timeSeconds: bunch.timeSeconds,
      staticActorId,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
      changedProperties,
      actor: bunch.actor,
      actorId: bunch.actor.actorNetGUID.value,
      netFieldExports: nfeGroup.netFieldExports,
      logger: globalData.logger,
    };

    try {
      globalData.emitters.properties.emit(exportGroup.type, exportData);
    } catch (err) {
      globalData.logger.error(`Error while exporting propertyExport "${exportGroup.type}": ${err.stack}`);
    }
  }

  return { exportGroup, changedProperties };
};
