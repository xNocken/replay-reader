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
const receivedReplicatorBunch = (bunch, archive, repObject, bHasRepLayout, globalData) => {
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

  const classNetCache = globalData.netGuidCache.tryGetClassNetCache(netFieldExportGroup.pathName, bunch.archive.header.EngineNetworkVersion >= 15)

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

    if (!fieldCache || fieldCache.incompatible || !numPayloadBits) {
      continue;
    }

    archive.addOffset(numPayloadBits);

    if (!netFieldParser.willReadType(classNetCache.pathName)) {
      archive.popOffset();

      continue;
    }

    const classNetProperty = netFieldParser.tryGetClassNetCacheProperty(fieldCache.name, classNetCache.pathName);

    if (classNetProperty) {
      if (classNetProperty.isFunction) {
        const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(classNetProperty.type);

        if (!exportGroup) {
          return false;
        }

        if (!receivedRPC(archive, exportGroup, bunch, globalData, staticActorId)) {
          return false;
        }
      } else if (classNetProperty.isCustomStruct) {
        if (!receiveCustomProperty(archive, classNetProperty, bunch, classNetCache.pathName, globalData, staticActorId)) {
          archive.popOffset();

          continue;
        }
      } else {
        const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(classNetProperty.type);

        if (!exportGroup) {
          return false;
        }

        if (!exportGroup || !netFieldParser.willReadType(exportGroup.pathName)) {
          archive.popOffset();

          continue;
        }

        if (receiveCustomDeltaProperty(archive, exportGroup, bunch, classNetProperty.EnablePropertyChecksum || false, globalData, staticActorId)) {
          archive.popOffset();

          continue;
        }
      }
    }

    archive.popOffset();
  }
};

module.exports = receivedReplicatorBunch;
