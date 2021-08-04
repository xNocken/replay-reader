const createRebuidExport = (bunch, exports, globalData) => {
  if (!globalData.result.packets[bunch.timeSeconds]) {
    globalData.result.packets[bunch.timeSeconds] = {};
  }

  if (!globalData.result.packets[bunch.timeSeconds][bunch.chIndex]) {
    globalData.result.packets[bunch.timeSeconds][bunch.chIndex] = {};
  }

  if (!globalData.result.packets[bunch.timeSeconds][bunch.chIndex][bunch.chSequence]) {
    globalData.result.packets[bunch.timeSeconds][bunch.chIndex][bunch.chSequence] = {
      exports,
      actor: bunch.bOpen ? globalData.channels[bunch.chIndex].actor : null,
      bOpen: bunch.bOpen,
      bClose: bunch.bClose,
      chName: bunch.chName,
      closeReason: bunch.closeReason,
      bReliable: bunch.bReliable,
      bIsReplicationPaused: bunch.bIsReplicationPaused,
      mustBeMappedGuids: bunch.mustBeMappedGUIDs,
    };
  } else {
    globalData.result.packets[bunch.timeSeconds][bunch.chIndex][bunch.chSequence].exports.push(...exports);
  }
};

module.exports = createRebuidExport;
