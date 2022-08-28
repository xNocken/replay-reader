import { Actor, BaseResult, BaseStates, Bunch, Channel } from '$types/lib';
import { NetFieldExportGroupInternal } from '$types/replay';
import pathhhh from 'path';
import GlobalData from '../../Classes/GlobalData';

export const onChannelOpened = <ResultType extends BaseResult>(channel: Channel, actor: Actor, bunch: Bunch, globalData: GlobalData<ResultType>) => {
  const { chIndex } = channel;

  try {
    globalData.emitters.parsing.emit('channelOpened', {
      chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
    });
  } catch (err) {
    console.error(`Error while exporting "channelOpened": ${err.stack}`);
  }

  if (!actor) {
    return;
  }

  globalData.actorToChannel[actor.actorNetGUID.value] = chIndex;
  globalData.channelToActor[chIndex] = actor.actorNetGUID.value;

  let netFieldExportGroup: NetFieldExportGroupInternal;
  let staticActorId: string;

  if (globalData.dormantActors[actor.actorNetGUID.value]) {
    globalData.dormantActors[actor.actorNetGUID.value] = false;

    return;
  }

  let repObject = 0;

  if (actor?.actorNetGUID.isDynamic()) {
    netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(actor.archetype.value, globalData);
    repObject = actor.archetype.value;
  } else if (actor) {
    const result = globalData.netGuidCache.getStaticActorExportGroup(actor.actorNetGUID.value);

    netFieldExportGroup = result.group;
    staticActorId = result.staticActorId;
    repObject = actor.actorNetGUID.value;
  }

  if (!netFieldExportGroup) {
    return;
  }

  const exportName = netFieldExportGroup.customExportName || pathhhh.basename(netFieldExportGroup.pathName);

  if (globalData.options.enableActorToPath) {
    const path = globalData.netGuidCache.tryGetFullPathName(repObject);

    globalData.actorToPath[actor.actorNetGUID.value] = path;
  }

  try {
    globalData.emitters.actorSpawn.emit(
      exportName,
      {
        openPacket: bunch.bOpen,
        chIndex: bunch.chIndex,
        timeSeconds: bunch.timeSeconds,
        netFieldExportGroup,
        staticActorId,
        globalData,
        actor,
        result: globalData.result,
        states: globalData.states,
        setFastForward: globalData.setFastForward,
        stopParsing: globalData.stopParsingFunc,
        actorId: actor.actorNetGUID.value,
      },
    );
  } catch (err) {
    console.error(`Error while exporting actorSpawn "${exportName}": ${err.stack}`);
  }
};
