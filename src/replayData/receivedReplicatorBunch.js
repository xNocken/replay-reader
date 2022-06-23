const NetDeltaSerialize = require("./netDeltaSerialize");
const readFieldHeaderAndPayload = require("./ReadFieldHeaderAndPayload");
const receiveCustomProperty = require("./receiveCustomProperty");
const receivedRPC = require("./receivedRPC");
const receiveProperties = require("./receiveProperties");

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

  const { netFieldParser } = globalData;

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

  let finished = false;

  while (!finished) {
    const result = readFieldHeaderAndPayload(archive, classNetCache);

    if (!result) {
      finished = true;

      break;
    }

    const { outField: fieldCache, numPayloadBits } = result;

    if (!fieldCache || fieldCache.incompatible) {
      archive.skipBits(numPayloadBits);

      continue;
    }

    archive.addOffset(5, numPayloadBits);

    if (fieldCache.parseType === 'function') {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroupString(
        fieldCache.type,
      );

      if (!exportGroup) {
        archive.popOffset(5);

        return false;
      }

      if (
        !receivedRPC(archive, exportGroup, bunch, globalData, staticActorId)
      ) {
        archive.popOffset(5);

        return false;
      }
    }

    if (fieldCache.parseType === 'class') {
      if (
        !receiveCustomProperty(
          archive,
          fieldCache,
          bunch,
          classNetCache.pathName,
          globalData,
          staticActorId,
        )
      ) {
        archive.popOffset(5);

        continue;
      }
    }

    if (fieldCache.parseType === 'netDeltaSerialize') {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroupString(
        fieldCache.type,
      );

      if (!exportGroup) {
        archive.popOffset(5);

        if (globalData.debug) {
          console.error(`class net cache ${fieldCache.name} from ${classNetCache.pathName} has been declared but has no export group`);
        }

        continue;
      }

      if (!exportGroup || !netFieldParser.willReadType(exportGroup.pathName)) {
        archive.popOffset(5);

        continue;
      }

      if (
        NetDeltaSerialize(
          archive,
          exportGroup,
          bunch,
          fieldCache.EnablePropertyChecksum || false,
          globalData,
          staticActorId,
        )
      ) {
        archive.popOffset(5);

        continue;
      }
    }

    archive.popOffset(5);
  }
};

module.exports = receivedReplicatorBunch;
