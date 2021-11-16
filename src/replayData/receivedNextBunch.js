const DataBunch = require('../Classes/DataBunch');
const receivedSequencedBunch = require('./receivedSequenceBunch');

/**
 * @param {DataBunch} bunch
 */
const receivedNextBunch = (bunch, globalData) => {
  if (bunch.bReliable) {
    globalData.inReliable = bunch.chSequence;
  }

  if (bunch.bPartial) {
    if (bunch.bPartialInital) {
      if (globalData.partialBunch) {
        if (!globalData.partialBunch.bPartialFinal) {
          if (globalData.partialBunch.bReliable) {
            if (bunch.bReliable) {
              return;
            }

            return;
          }
        }

        globalData.partialBunch = null;
      }

      globalData.partialBunch = {};

      globalData.partialBunch.archive = bunch.archive;
      globalData.partialBunch.packetId = bunch.packetId;
      globalData.partialBunch.chIndex = bunch.chIndex;
      globalData.partialBunch.chType = bunch.chType;
      globalData.partialBunch.chName = bunch.chName;
      globalData.partialBunch.chSequence = bunch.chSequence;
      globalData.partialBunch.bOpen = bunch.bOpen;
      globalData.partialBunch.bClose = bunch.bClose;
      globalData.partialBunch.bDormant = bunch.bDormant;
      globalData.partialBunch.bIsReplicationPaused = bunch.bIsReplicationPaused;
      globalData.partialBunch.bReliable = bunch.bReliable;
      globalData.partialBunch.bPartial = bunch.bPartial;
      globalData.partialBunch.bPartialInitial = bunch.bPartialInitial;
      globalData.partialBunch.bPartialFinal = bunch.bPartialFinal;
      globalData.partialBunch.bHasPackageMapExports = bunch.bHasPackageMapExports;
      globalData.partialBunch.bHasMustBeMappedGUIDs = bunch.bHasMustBeMappedGUIDs;
      globalData.partialBunch.bIgnoreRPCs = bunch.bIgnoreRPCs;
      globalData.partialBunch.closeReason = bunch.closeReason;
      globalData.partialBunch.timeSeconds = bunch.timeSeconds;

      const bitsLeft = bunch.archive.getBitsLeft();

      if (!bunch.bHasPackageExportMaps) {
        if ((bitsLeft & 7) != 0) {
          return;
        }
      }

      return;
    } else {
      let bSequenceMatches = false;

      if (globalData.partialBunch) {
        const bReliableSequencesMatches = bunch.chSequence === globalData.partialBunch.chSequence + 1;
        const bUnreliableSequenceMatches = bReliableSequencesMatches || (bunch.chSequence === globalData.partialBunch.chSequence);

        bSequenceMatches = globalData.partialBunch.bReliable ? bReliableSequencesMatches : bUnreliableSequenceMatches;
      }

      if (globalData.partialBunch && !globalData.partialBunch.bPartialFinal && bSequenceMatches && globalData.partialBunch.bReliable == bunch.bReliable) {
        const bitsLeft = bunch.archive.getBitsLeft();

        if (!bunch.bHasPackageExportMaps && bitsLeft > 0) {
          globalData.partialBunch.archive.appendDataFromChecked(bunch.archive.readBits(bitsLeft), bitsLeft);
        }

        if (!bunch.bHasPackageExportMaps && !bunch.bPartialFinal && ((bitsLeft & 7) != 0)) {
          return;
        }

        globalData.partialBunch.chSequence = bunch.chSequence;

        if (bunch.bPartialFinal) {
          if (bunch.bHasPackageExportMaps) {
            return;
          }

          globalData.partialBunch.bPartialFinal = true;
          globalData.partialBunch.bClose = bunch.bClose;
          globalData.partialBunch.bDormant = bunch.bDormant;
          globalData.partialBunch.closeReason = bunch.closeReason;
          globalData.partialBunch.bIsReplicationPaused = bunch.bIsReplicationPaused;
          globalData.partialBunch.bhasMustBeMappedGUIDs = bunch.bHasMustBeMappedGUIDs;

          receivedSequencedBunch(globalData.partialBunch, globalData);
          return
        }
        return;
      } else {
        return;
      }
    }
  }

  receivedSequencedBunch(bunch, globalData);
};

module.exports = receivedNextBunch;
