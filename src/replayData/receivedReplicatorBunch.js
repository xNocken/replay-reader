const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const GlobalData = require('../utils/globalData');
const readFieldHeaderAndPayload = require('./ReadFieldHeaderAndPayload');
const receiveCustomDeltaProperty = require('./receiveCustomDeltaProperty');
const receiveCustomProperty = require('./receiveCustomProperty');
const receivedRPC = require('./receivedRPC');
const receiveProperties = require('./receiveProperties');

/**
 * @param {DataBunch} bunch
 * @param {Replay} archive
 * @param {number} repObject
 * @param {boolean} bHasRepLayout
 * @param {GlobalData} globalData
 */
const receivedReplicatorBunch = (bunch, archive, repObject, bHasRepLayout, bIsActor, globalData) => {
  let netFieldExportGroup;
  let staticActorId;

  if (bunch.actor.actorNetGUID.isDynamic()) {
    netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(repObject, globalData);
  } else {
    const result = globalData.netGuidCache.getStaticActorExportGroup(repObject, globalData);

    netFieldExportGroup = result.group;
    staticActorId = result.staticActorId;
  }

  if (!netFieldExportGroup) {
    if (bIsActor) {
      globalData.ignoredChannels[bunch.chIndex] = true;
    }

    return true;
  }

  const { netFieldParser } = globalData;

  if (bHasRepLayout) {
    if (!receiveProperties(archive, netFieldExportGroup, bunch, true, false, globalData, staticActorId)) {
      return false;
    }
  }

  if (archive.atEnd()) {
    return true;
  }

  const classNetCache = globalData.netGuidCache.tryGetClassNetCache(netFieldExportGroup.pathName, bunch.archive.header.EngineNetworkVersion >= 15);

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

    if (!numPayloadBits) {
      continue;
    }

    if (!fieldCache || fieldCache.incompatible) {
      archive.skipBits(numPayloadBits);

      continue;
    }

    archive.addOffset(5, numPayloadBits);

    if (fieldCache.isFunction) {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(fieldCache.type);

      if (!exportGroup) {
        return false;
      }

      if (!receivedRPC(archive, exportGroup, bunch, globalData, staticActorId)) {
        return false;
      }
    } else if (fieldCache.isCustomStruct) {
      if (!receiveCustomProperty(archive, fieldCache, bunch, classNetCache.pathName, globalData, staticActorId)) {
        archive.popOffset(5);

        continue;
      }
    } else {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(fieldCache.type);

      if (!exportGroup) {
        return false;
      }

      if (!exportGroup || !netFieldParser.willReadType(exportGroup.pathName)) {
        archive.popOffset(5);

        continue;
      }

      if (receiveCustomDeltaProperty(archive, exportGroup, bunch, fieldCache.EnablePropertyChecksum || false, globalData, staticActorId)) {
        archive.popOffset(5);

        continue;
      }
    }

    archive.popOffset(5);
  }
};

module.exports = receivedReplicatorBunch;
