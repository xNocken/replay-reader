const DataBunch = require('../Classes/DataBunch');
const NetBitReader = require('../Classes/NetBitReader');
const { netFieldParser } = require('../utils/globalData');
const netGuidCache = require('../utils/netGuidCache');
const readFieldHeaderAndPayload = require('./ReadFieldHeaderAndPayload');
const receiveCustomProperty = require('./receiveCustomProperty');
const receiveProperties = require('./recieveProperties');

/**
 *
 * @param {DataBunch} bunch
 * @param {NetBitReader} archive
 * @param {number} repObject
 * @param {boolean} bHasRepLayout
 */
const recievedReplicatorBunch = (bunch, archive, repObject, bHasRepLayout) => {
  const netFielExportGroup = netGuidCache.GetNetFieldExportGroup(repObject);

  if (netFielExportGroup == null) {
    return true;
  }

  if (bHasRepLayout) {
    if (!receiveProperties(archive, netFielExportGroup, bunch.chIndex)) {
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

    if (fieldCache === null || fieldCache.incompatible || reader === null || reader.isError || reader.atEnd()) {
      continue;
    }

    if (!netFieldParser.willReadType(classNetCache.pathName)) {
      continue;
    }

    const classNetProperty = netFieldParser.tryGetClassNetCacheProperty(fieldCache.name, classNetCache.pathName);

    if (classNetProperty)  {
      if (classNetProperty.isFunction) {
        throw Error('RPC not yet implemented');
      } else if (classNetProperty.isCustomStruct) {
        if (!receiveCustomProperty(reader, classNetProperty, bunch.chIndex, classNetCache.pathName)) {
          continue;
        }
      } else {
        throw Error('CustomDeltaProperty not yet implemented');
      }
    }
  }
};

module.exports = recievedReplicatorBunch;
