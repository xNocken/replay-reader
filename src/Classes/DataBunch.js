const NetBitReader = require('./NetBitReader');

class DataBunch {
  /**
   * @type {NetBitReader}
   */
  archive;
  packetId;
  chIndex;
  chType;
  chName;
  chSequence;
  bOpen;
  bClose;
  bDormant;
  bIsReplicationPaused
  bReliable;
  bPartial;
  bPartialInital;
  bPartialFinal;
  bHasPackageExportMaps;
  bHasMustBeMappedGUIDs;
  bIgnoreRPCs;
  closeReason;

  constructor () {

  }
}

module.exports = DataBunch;
