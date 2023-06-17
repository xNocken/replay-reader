import { BaseResult, BaseStates, Bunch, CustomClass, PropertyExport } from '../../../../types/lib';
import { NetFieldExportInternal } from '../../../../types/nfe';
import GlobalData from '../../../Classes/GlobalData';
import Replay from '../../../Classes/Replay';

export const receiveCustomProperty = (reader: Replay, fieldCache: NetFieldExportInternal, bunch: Bunch, globalData: GlobalData, staticActorId: string) => {
  const theClass = globalData.netFieldParser.getClass(fieldCache.type);
  const instance: CustomClass = new theClass();

  instance.serialize(reader, globalData, fieldCache.config);

  if (instance.resolve) {
    instance.resolve(globalData.netGuidCache, globalData);
  }

  const type = fieldCache.exportName;

  try {
    if (globalData.options.debug && !globalData.emitters.properties.eventNames().includes(type)) {
      globalData.logger.warn(`custom property export ${type} not handled`);
    }

    const exportData: PropertyExport<BaseResult, BaseStates, CustomClass> = {
      chIndex: bunch.chIndex,
      data: instance,
      timeSeconds: bunch.timeSeconds,
      staticActorId,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
      actor: bunch.actor,
      actorId: bunch.actor.actorNetGUID.value,
      logger: globalData.logger,
      changedProperties: [],
      netFieldExports: [],
    };

    globalData.emitters.properties.emit(type, exportData);
  } catch (err) {
    globalData.logger.error(`Error while exporting propertyExport "${type}": ${err.stack}`);
  }
};