import { Bunch } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import { processBunch } from './process-bunch';

export const receivedNextBunch = (bunch: Bunch, globalData: GlobalData) => {
  if (bunch.bReliable) {
    globalData.inReliable = bunch.chSequence;
  }

  if (!bunch.bPartial) {
    processBunch(bunch, globalData);

    return;
  }

  if (bunch.bPartialInital) {
    if (globalData.partialBunch && !globalData.partialBunch.bPartialFinal && globalData.partialBunch.bReliable) {
      return;
    }

    globalData.partialBunch = {
      archive: bunch.archive,
      packetId: bunch.packetId,
      chIndex: bunch.chIndex,
      chType: bunch.chType,
      chName: bunch.chName,
      chSequence: bunch.chSequence,
      bOpen: bunch.bOpen,
      bClose: bunch.bClose,
      bDormant: bunch.bDormant,
      bIsReplicationPaused: bunch.bIsReplicationPaused,
      bReliable: bunch.bReliable,
      bPartial: bunch.bPartial,
      bPartialInital: bunch.bPartialInital,
      bPartialFinal: bunch.bPartialFinal,
      bHasPackageExportMaps: bunch.bHasPackageExportMaps,
      bHasMustBeMappedGUIDs: bunch.bHasMustBeMappedGUIDs,
      closeReason: bunch.closeReason,
      timeSeconds: bunch.timeSeconds,
      bControl: bunch.bControl,
      bunchDataBits: bunch.bunchDataBits,
    };

    return;
  }

  let bSequenceMatches = false;

  if (globalData.partialBunch) {
    const bReliableSequencesMatches = bunch.chSequence === globalData.partialBunch.chSequence + 1;
    const bUnreliableSequenceMatches = bReliableSequencesMatches
      || (bunch.chSequence === globalData.partialBunch.chSequence);

    bSequenceMatches = globalData.partialBunch.bReliable ? bReliableSequencesMatches : bUnreliableSequenceMatches;
  }

  if (
    globalData.partialBunch
    && !globalData.partialBunch.bPartialFinal
    && bSequenceMatches
    && globalData.partialBunch.bReliable == bunch.bReliable
  ) {
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
      globalData.partialBunch.bHasMustBeMappedGUIDs = bunch.bHasMustBeMappedGUIDs;

      processBunch(globalData.partialBunch, globalData);
    }
  }
};
