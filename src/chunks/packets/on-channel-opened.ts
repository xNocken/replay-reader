import { Actor, ActorSpawnExport, BaseResult, BaseStates, Bunch, Channel, ChannelOpenedClosedExport } from '$types/lib';
import { NetFieldExportGroupInternal } from '$types/replay';
import pathhhh from 'path';
import GlobalData from '../../Classes/GlobalData';

export const onChannelOpened = (channel: Channel, actor: Actor, bunch: Bunch, globalData: GlobalData) => {
  const { chIndex } = channel;

  try {
    const exportData: ChannelOpenedClosedExport<BaseResult, BaseStates> = {
      chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
      logger: globalData.logger,
    };

    globalData.emitters.parsing.emit('channelOpened', exportData);
  } catch (err) {
    globalData.logger.error(`Error while exporting "channelOpened": ${err.stack}`);
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
    const exportData: ActorSpawnExport<BaseResult, BaseStates> = {
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
      logger: globalData.logger,
    };

    globalData.emitters.actorSpawn.emit(exportName, exportData);
  } catch (err) {
    globalData.logger.error(`Error while exporting actorSpawn "${exportName}": ${err.stack}`);
  }
};
