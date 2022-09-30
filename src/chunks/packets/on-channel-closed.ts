import { ActorDespawnExport, BaseResult, BaseStates, Bunch, ChannelOpenedClosedExport } from '../../../types/lib';
import { NetFieldExportGroupInternal } from '../../../types/replay';
import GlobalData from '../../Classes/GlobalData';

export const onChannelClosed = (bunch: Bunch, globalData: GlobalData) => {
  const channel = globalData.channels[bunch.chIndex];
  const actor = channel.actor;

  if (!bunch.bDormant) {
    let netFieldExportGroup: NetFieldExportGroupInternal;
    let staticActorId: string;

    if (channel.actor?.actorNetGUID.isDynamic()) {
      netFieldExportGroup = globalData.netGuidCache.getNetFieldExportGroup(channel.actor.archetype.value, globalData);
    } else if (channel.actor) {
      const result = globalData.netGuidCache.getStaticActorExportGroup(channel.actor.actorNetGUID.value);

      netFieldExportGroup = result.group;
      staticActorId = result.staticActorId;
    }

    if (netFieldExportGroup) {
      try {
        const exportData: ActorDespawnExport<BaseResult, BaseStates> = {
          openPacket: bunch.bOpen,
          chIndex: bunch.chIndex,
          timeSeconds: bunch.timeSeconds,
          netFieldExportGroup,
          staticActorId,
          globalData,
          result: globalData.result,
          states: globalData.states,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
          actor: channel.actor,
          actorId: actor.actorNetGUID.value,
          logger: globalData.logger,
        };

        globalData.emitters.actorDespawn.emit(
          netFieldExportGroup.exportName,
          exportData,
        );
      } catch (err) {
        globalData.logger.error(`Error while exporting actorDespawn "${netFieldExportGroup.exportName}": ${err.stack}`);
      }
    }
  } else {
    globalData.dormantActors[actor.actorNetGUID.value] = true;
  }

  try {
    const exportData: ChannelOpenedClosedExport<BaseResult, BaseStates> = {
      chIndex: bunch.chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
      logger: globalData.logger,
    };

    globalData.emitters.parsing.emit('channelClosed', exportData);
  } catch (err) {
    globalData.logger.error(`Error while exporting "channelClosed": ${err.stack}`);
  }

  delete globalData.ignoredChannels[bunch.chIndex];
  delete globalData.channels[bunch.chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.actorNetGUID.value];
    delete globalData.channelToActor[bunch.chIndex];
  }
};
