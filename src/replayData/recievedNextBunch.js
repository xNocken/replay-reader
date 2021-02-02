const DataBunch = require('../Classes/DataBunch');
const recievedSequencedBunch = require('./recievedSequenceBunch');
const globalData = require('../utils/globalData');
/**
 * @param {DataBunch} bunch
 */
const recievedNextBunch = (bunch) => {
  if (bunch.bReliable) {
    globalData.inReliable = bunch.chSequence;
  }

  if (bunch.bPartial) {
    if (bunch.bPartialInital) {
      if (globalData.partialBunch != null) {
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

      globalData.partialBunch = new DataBunch();
      const bitsLeft = bunch.archive.getBitsLeft();

      if (!bunch.bHasPackageExportMaps) {
        if (bitsLeft % 8 != 0) {
          return;
        }
      } else {

      }

      return;
    } else {
      let bSequenceMatches = false;

      if (globalData.partialBunch != null) {
        const bReliableSequencesMatches = bunch.chSequence === globalData.partialBunch.chSequence + 1;
        const bUnreliableSequenceMatches = bReliableSequencesMatches || (bunch.chSequence === globalData.partialBunch.chSequence);

        bSequenceMatches = globalData.partialBunch.bReliable ? bReliableSequencesMatches : bUnreliableSequenceMatches;
      }

      if (globalData.partialBunch != null && !globalData.partialBunch.bPartialFinal && bSequenceMatches && globalData.partialBunch.bReliable == bunch.bReliable) {
        const bitsLeft = bunch.archive.getBitsLeft();

        if (!bunch.bHasPackageExportMaps && bitsLeft > 0) {
          globalData.partialBunch.archive.appendDataFromChecked(bunch.archive.readBits(bitsLeft), bitsLeft);
        }

        if (!bunch.bHasPackageExportMaps && !bunch.bPartialFinal && (bitsLeft % 8 != 0)) {
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

          recievedSequencedBunch(bunch);
          return
        }
        return;
      } else {
        return;
      }
    }
  }

  recievedSequencedBunch(bunch);
};

module.exports = recievedNextBunch;
