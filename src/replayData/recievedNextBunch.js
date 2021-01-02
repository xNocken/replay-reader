const DataBunch = require('../Classes/DataBunch');
const recievedSequencedBunch = require('./recievedSequenceBunch');
/**
 * @var {DataBunch} partialBunch
 */
let partialBunch = null;

/**
 * @param {DataBunch} bunch
 */
const recievedNextBunch = (bunch) => {
  if (bunch.bReliable) {
    inReliable = bunch.chSequence;
  }

  if (bunch.bPartial) {
    if (bunch.bPartialInital) {
      if (partialBunch != null) {
        if (!partialBunch.bPartialFinal) {
          if (partialBunch.bReliable) {
            if (bunch.bReliable) {
              return;
            }

            return;
          }
        }

        partialBunch = null;
      }

      partialBunch = new DataBunch();
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

      if (partialBunch != null) {
        const bReliableSequencesMatches = bunch.chSequence === partialBunch.chSequence + 1;
        const bUnreliableSequenceMatches = bReliableSequencesMatches || (bunch.chSequence === partialBunch.chSequence);

        bSequenceMatches = partialBunch.bReliable ? bReliableSequencesMatches : bUnreliableSequenceMatches;
      }

      if (partialBunch != null && !partialBunch.bPartialFinal && bSequenceMatches && partialBunch.bReliable == bunch.bReliable) {
        const bitsLeft = bunch.archive.getBitsLeft();

        if (!bunch.bHasPackageExportMaps && bitsLeft > 0) {
          partialBunch.archive.appendDataFromChecked(bunch.archive.readBits(bitsLeft), bitsLeft);
        }

        if (!bunch.bHasPackageExportMaps && !bunch.bPartialFinal && (bitsLeft % 8 != 0)) {
          return;
        }

        partialBunch.chSequence = bunch.chSequence;

        if (bunch.bPartialFinal) {

          if (bunch.bHasPackageExportMaps) {
            return;
          }

          partialBunch.bPartialFinal = true;
          partialBunch.bClose = bunch.bClose;
          partialBunch.bDormant = bunch.bDormant;
          partialBunch.closeReason = bunch.closeReason;
          partialBunch.bIsReplicationPaused = bunch.bIsReplicationPaused;
          partialBunch.bhasMustBeMappedGUIDs = bunch.bHasMustBeMappedGUIDs;

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
