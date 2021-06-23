const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const netGuidCache = require('../utils/netGuidCache');
const readFieldHeaderAndPayload = require('./ReadFieldHeaderAndPayload');
const receiveCustomDeltaProperty = require('./receiveCustomDeltaProperty');
const receiveCustomProperty = require('./receiveCustomProperty');
const receivedRPC = require('./receivedRPC');
const receiveProperties = require('./recieveProperties');

/**
 * @param {DataBunch} bunch
 * @param {Replay} archive
 * @param {number} repObject
 * @param {boolean} bHasRepLayout
 */
const recievedReplicatorBunch = (bunch, archive, repObject, bHasRepLayout, globalData) => {
  const netFielExportGroup = netGuidCache.GetNetFieldExportGroup(repObject, globalData);
  const { netFieldParser } = globalData;

  if (netFielExportGroup == null) {
    return true;
  }

  if (bHasRepLayout) {
    if (!receiveProperties(archive, netFielExportGroup, bunch, true, false, globalData)) {
      return false;
    }
  }

  if (archive.atEnd()) {
    return true;
  }

  const classNetCache = netGuidCache.tryGetClassNetCache(netFielExportGroup.pathName, bunch.archive.header.EngineNetworkVersion >= 15)

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
        var functionGroup = netGuidCache.GetNetFieldExportGroup(classNetProperty.type);

        if (!receivedRPC(archive, functionGroup, bunch, globalData)) {
          return false;
        }
      } else if (classNetProperty.isCustomStruct) {
        if (!receiveCustomProperty(archive, classNetProperty, bunch, classNetCache.pathName, globalData)) {
          archive.popOffset();

          continue;
        }
      } else {
        const group = netGuidCache.GetNetFieldExportGroup(classNetProperty.type);

        if (!group || !netFieldParser.willReadType(group.pathName)) {
          archive.popOffset();

          continue;
        }

        if (receiveCustomDeltaProperty(archive, group, bunch, classNetProperty.EnablePropertyChecksum || true, globalData)) {
          archive.popOffset();

          continue;
        }
      }
    }

    archive.popOffset();
  }
};

module.exports = recievedReplicatorBunch;
