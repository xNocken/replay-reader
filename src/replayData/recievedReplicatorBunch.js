const DataBunch = require('../Classes/DataBunch');
const NetBitReader = require('../Classes/NetBitReader');
const netGuidCache = require('../utils/netGuidCache');
const readFieldHeaderAndPayload = require('./ReadFieldHeaderAndPayload');
const receiveCustomDeltaProperty = require('./receiveCustomDeltaProperty');
const receiveCustomProperty = require('./receiveCustomProperty');
const receiveProperties = require('./recieveProperties');

/**
 *
 * @param {DataBunch} bunch
 * @param {NetBitReader} archive
 * @param {number} repObject
 * @param {boolean} bHasRepLayout
 */
const recievedReplicatorBunch = (bunch, archive, repObject, bHasRepLayout, globalData) => {
  const netFielExportGroup = netGuidCache.GetNetFieldExportGroup(repObject);
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

    const { outField: fieldCache, reader } = result;

    if (!fieldCache || fieldCache.incompatible || !reader || reader.isError || reader.atEnd()) {
      continue;
    }

    if (!netFieldParser.willReadType(classNetCache.pathName)) {
      continue;
    }

    const classNetProperty = netFieldParser.tryGetClassNetCacheProperty(fieldCache.name, classNetCache.pathName);

    if (classNetProperty) {
      if (classNetProperty.isFunction) {
        throw Error('RPC not yet implemented'); // TODO
      } else if (classNetProperty.isCustomStruct) {
        if (!receiveCustomProperty(reader, classNetProperty, bunch, classNetCache.pathName, globalData)) {
          continue;
        }
      } else {
        const group = netGuidCache.GetNetFieldExportGroup(classNetProperty.type);

        if (!netFieldParser.willReadType(group.pathName)) {
          continue;
        }

        if (group) {
          if (receiveCustomDeltaProperty(reader, group, bunch, classNetProperty.EnablePropertyChecksum, globalData)) {
            continue;
          }
        }
      }
    }
  }
};

module.exports = recievedReplicatorBunch;
