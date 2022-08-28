import { BaseResult, BaseStates, Bunch, CustomClass } from '$types/lib';
import { NetFieldExportInternal } from '$types/replay';
import classes from '../../../../Classes';
import GlobalData from '../../../Classes/GlobalData';
import Replay from '../../../Classes/Replay';

export const receiveCustomProperty = <ResultType extends BaseResult>(reader: Replay, fieldCache: NetFieldExportInternal, bunch: Bunch, pathName: string, globalData: GlobalData<ResultType>, staticActorId: string) => {
  const theClass = globalData.options.customClasses[fieldCache.type] || classes[fieldCache.type];
  const instance: CustomClass<ResultType> = new theClass();

  instance.serialize(reader, globalData, fieldCache.config);

  if (instance.resolve) {
    instance.resolve(globalData.netGuidCache, globalData);
  }

  const type = fieldCache.customExportName || pathName.split('/').pop();

  try {
    globalData.emitters.properties.emit(
      type,
      {
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
      },
    );
  } catch (err) {
    console.error(`Error while exporting propertyExport "${type}": ${err.stack}`);
  }
};
