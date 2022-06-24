const receiveProperties = require("./receive-properties");
const readClassNetCache = require("./class-net-cache/read-class-net-cache");

/**
 * @param {number} repObject
 * @param {boolean} bHasRepLayout
 */
const receivedReplicatorBunch = (
  bunch,
  archive,
  repObject,
  bHasRepLayout,
  bIsActor,
  globalData,
) => {
  let netFieldExportGroup;
  let staticActorId;

  if (bunch.actor.actorNetGUID.isDynamic() || !bIsActor) {
    netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(
      repObject,
      globalData,
    );
  } else {
    const result = globalData.netGuidCache.getStaticActorExportGroup(
      repObject,
      globalData,
    );

    netFieldExportGroup = result.group;
    staticActorId = result.staticActorId;
  }

  if (!netFieldExportGroup) {
    if (bIsActor && !globalData.debug) {
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

module.exports = receivedReplicatorBunch;
