import { BaseExport, BaseResult, BaseStates, Bunch, Export, PropertyExport } from '$types/lib';
import { NetFieldExportGroupInternal } from '$types/replay';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const receiveProperties = <ResultType extends BaseResult>(
  archive: Replay,
  nfeGroup: NetFieldExportGroupInternal,
  bunch: Bunch,
  enableProperyChecksum = true,
  netDeltaUpdate = false,
  globalData: GlobalData<ResultType>,
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
        key = nfe.name;
      }

      changedProperties.push(key);

      const result = netFieldParser.setType(nfe, nfeGroup, archive, globalData);

      if (result === null) {
        nfe.incompatible = true;
      }

      exportGroup[key] = result;
    } catch (ex) {
      console.log(ex.stack);
    } finally {
      archive.popOffset(6, numbits, true);
    }
  }

  if (!netDeltaUpdate && changedProperties.length) {
    const actor = bunch.actor;
    const externalData = globalData.externalData[actor.actorNetGUID.value];

    if (externalData) {
      delete globalData.externalData[actor.actorNetGUID.value];
      const nfe = nfeGroup?.netFieldExports[externalData.handle];

      if (nfe) {
        const payloadReader = new Replay(externalData.payload);

        payloadReader.header = archive.header;

        let key;

        if ((nfeGroup.parseUnknownHandles && !nfe.parseType) || nfeGroup.storeAsHandle || nfe.storeAsHandle) {
          key = nfe.handle;
        } else {
          key = nfe.name;
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
      console.log('Unhandled export', exportGroup.type);
    }

    const exportData: PropertyExport<ResultType, BaseStates, BaseExport> = {
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
    };

    try {
      globalData.emitters.properties.emit(
        exportGroup.type,
        exportData,
      );
    } catch (err) {
      console.error(`Error while exporting propertyExport "${exportGroup.type}": ${err.stack}`);
    }
  }

  return { exportGroup, changedProperties };
};
