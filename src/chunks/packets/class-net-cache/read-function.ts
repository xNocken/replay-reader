import { BaseResult, BaseStates, Bunch, Data, FunctionCall } from '../../../../types/lib';
import { NetFieldExportGroupInternal, NetFieldExportInternal } from '../../../../types/nfe';
import GlobalData from '../../../Classes/GlobalData';
import Replay from '../../../Classes/Replay';
import { receiveProperties } from '../receive-properties';

export const readFunction = (
  archive: Replay,
  bunch: Bunch,
  numPayloadBits: number,
  staticActorId: string,
  fieldCache: NetFieldExportInternal,
  classNetCache: NetFieldExportGroupInternal,
  globalData: GlobalData,
) => {
  let data: Data = null;
  let changedProperties: (string | number)[] = [];
  let exportGroup: NetFieldExportGroupInternal;

  if (numPayloadBits) {
    if (!fieldCache.type) {
      globalData.logger.error(`No type is set for function that has data ${classNetCache.pathName} -> ${fieldCache.name}`);

      return false;
    }

    exportGroup = globalData.netGuidCache.getNFEReference(
      fieldCache.type,
    );

    if (!exportGroup) {
      globalData.logger.error(`Could not find export group for ${fieldCache.type} defined in ${classNetCache.pathName} -> ${fieldCache.name}`);

      return false;
    }

    const parsed = receiveProperties(archive, exportGroup, bunch, true, false, globalData, staticActorId);

    if (!parsed) {
      return false;
    }

    data = parsed.exportGroup;
    changedProperties = parsed.changedProperties;
  }

  const exportName = exportGroup?.exportName || fieldCache.exportName;

  const exportData: FunctionCall<BaseResult, BaseStates, Data> = {
    actor: bunch.actor,
    actorId: bunch.actor.actorNetGUID.value,
    changedProperties,
    data,
    chIndex: bunch.chIndex,
    globalData,
    hasData: numPayloadBits !== 0,
    logger: globalData.logger,
    netFieldExports: exportGroup?.netFieldExports,
    result: globalData.result,
    states: globalData.states,
    setFastForward: globalData.setFastForward,
    stopParsing: globalData.stopParsingFunc,
    staticActorId,
    timeSeconds: bunch.timeSeconds,
  };

  if (globalData.options.debug && !globalData.emitters.functionCall.eventNames().includes(exportName)) {
    globalData.logger.warn(`Unhandled function call ${exportName}`);
  }

  globalData.emitters.functionCall.emit(exportName, exportData);

  if (!archive.atEnd()) {
    return false;
  }
};
