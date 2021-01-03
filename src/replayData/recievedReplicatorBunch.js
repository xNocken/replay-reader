const DataBunch = require('../Classes/DataBunch');
const NetBitReader = require('../Classes/NetBitReader');
const netGuidCache = require('../utils/netGuidCache');
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
    if (receiveProperties(archive, netFielExportGroup, bunch.chIndex)) {

    }
  }
};

module.exports = recievedReplicatorBunch;
