import { receiveProperties } from './receive-properties';
import { readClassNetCache } from './class-net-cache/read-class-net-cache';
import { BaseResult, BaseStates, Bunch } from '$types/lib';
import Replay from '../../Classes/Replay';
import GlobalData from '../../Classes/GlobalData';
import { NetFieldExportGroupInternal } from '$types/replay';

export const receivedReplicatorBunch = <ResultType extends BaseResult>(
  bunch: Bunch,
  archive: Replay,
  repObject: number,
  bHasRepLayout: boolean,
  bIsActor: boolean,
  globalData: GlobalData<ResultType>,
) => {
  let netFieldExportGroup: NetFieldExportGroupInternal;
  let staticActorId: string;

  if (bunch.actor.actorNetGUID.isDynamic() || !bIsActor) {
    netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(
      repObject,
      globalData,
    );
  } else {
    const result = globalData.netGuidCache.getStaticActorExportGroup(
      repObject,
    );

    netFieldExportGroup = result.group;
    staticActorId = result.staticActorId;
  }

  if (!netFieldExportGroup) {
    if (bIsActor && !globalData.options.debug) {
      globalData.ignoredChannels[bunch.chIndex] = true;
    }

    return true;
  }

  if (bHasRepLayout) {
    if (
      !receiveProperties(
        archive,
        netFieldExportGroup,
        bunch,
        true,
        false,
        globalData,
        staticActorId,
      )
    ) {
      return false;
    }
  }

  if (archive.atEnd()) {
    return true;
  }

  const classNetCache = globalData.netGuidCache.tryGetClassNetCache(
    netFieldExportGroup.pathName,
    bunch.archive.header.engineNetworkVersion >= 15,
  );

  if (!classNetCache) {
    return false;
  }

  readClassNetCache(archive, bunch, staticActorId, classNetCache, globalData);
};
