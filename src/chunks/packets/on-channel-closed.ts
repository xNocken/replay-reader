import { BaseResult, BaseStates, Bunch } from '$types/lib';
import { NetFieldExportGroupInternal } from '$types/replay';
import pathhhh from 'path';
import GlobalData from '../../Classes/GlobalData';

export const onChannelClosed = <ResultType extends BaseResult>(bunch: Bunch, globalData: GlobalData<ResultType>) => {
  const channel = globalData.channels[bunch.chIndex];
  const actor = channel.actor;

  if (!bunch.bDormant) {
    let netFieldExportGroup: NetFieldExportGroupInternal;
    let staticActorId: string;

    if (channel.actor?.actorNetGUID.isDynamic()) {
      netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(channel.actor.archetype.value, globalData);
    } else if (channel.actor) {
      const result = globalData.netGuidCache.getStaticActorExportGroup(channel.actor.actorNetGUID.value);

      netFieldExportGroup = result.group;
      staticActorId = result.staticActorId;
    }

    if (netFieldExportGroup) {
      try {
        globalData.emitters.actorDespawn.emit(
          netFieldExportGroup.customExportName || pathhhh.basename(netFieldExportGroup.pathName),
          {
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
          },
        );
      } catch (err) {
        console.error(`Error while exporting actorDespawn "${pathhhh.basename(netFieldExportGroup.pathName)}": ${err.stack}`);
      }
    }
  } else {
    globalData.dormantActors[actor.actorNetGUID.value] = true;
  }

  try {
    globalData.emitters.parsing.emit('channelClosed', {
      chIndex: bunch.chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
    });
  } catch (err) {
    console.error(`Error while exporting "channelClosed": ${err.stack}`);
  }

  delete globalData.ignoredChannels[bunch.chIndex];
  delete globalData.channels[bunch.chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.actorNetGUID.value];
    delete globalData.channelToActor[bunch.chIndex];
  }
};
