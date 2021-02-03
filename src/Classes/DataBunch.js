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

  constructor (inBunch) {
    if (!inBunch) {
      return;
    }

    this.archive = inBunch.archive;
    this.packetId = inBunch.packetId;
    this.chIndex = inBunch.chIndex;
    this.chType = inBunch.chType;
    this.chName = inBunch.chName;
    this.chSequence = inBunch.chSequence;
    this.bOpen = inBunch.bOpen;
    this.bClose = inBunch.bClose;
    this.bDormant = inBunch.bDormant;
    this.bIsReplicationPaused = inBunch.bIsReplicationPaused;
    this.bReliable = inBunch.bReliable;
    this.bPartial = inBunch.bPartial;
    this.bPartialInitial = inBunch.bPartialInitial;
    this.bPartialFinal = inBunch.bPartialFinal;
    this.bHasPackageMapExports = inBunch.bHasPackageMapExports;
    this.bHasMustBeMappedGUIDs = inBunch.bHasMustBeMappedGUIDs;
    this.bIgnoreRPCs = inBunch.bIgnoreRPCs;
    this.closeReason = inBunch.closeReason;
  }
}

module.exports = DataBunch;
