const receivePropertiesForRebuild = (archive, group, mapObjectName, bunch, globalData) => {
  const channel = globalData.channels[bunch.chIndex];
  const channelIndex = bunch.chIndex;
  const properties = [];

  if (!globalData.result.packets[bunch.timeSeconds]) {
    globalData.result.packets[bunch.timeSeconds] = {};
  }

  if (!globalData.result.packets[bunch.timeSeconds][channelIndex]) {
    globalData.result.packets[bunch.timeSeconds][channelIndex] = {};
  }

  if (!globalData.result.packets[bunch.timeSeconds][channelIndex][bunch.chSequence]) {
    globalData.result.packets[bunch.timeSeconds][channelIndex][bunch.chSequence] = {
      exports: [],
      actor: bunch.bOpen ? channel.actor : null,
      bOpen: bunch.bOpen,
      bClose: bunch.bClose,
    };
  }

  globalData.result.packets[bunch.timeSeconds][channelIndex][bunch.chSequence].exports.push({
    pathName: group.pathName,
    mapObjectName,
    properties,
  });

  while (true) {
    let handle = archive.readIntPacked();

    if (handle === 0) {
      break;
    }

    handle--;

    if (!group.isValidIndex(handle)) {
      continue;
    }

    const exportt = group?.netFieldExports[handle];
    const numbits = archive.readIntPacked();

    if (!exportt) {
      archive.skipBits(numbits);
      continue;
    }

    try {
      archive.addOffset(numbits);

      if (globalData.rebuildMode) {
        properties.push({
          name: exportt.name,
          data: Array.from(archive.readBits(numbits, true)),
          size: numbits,
          compatibleChecksum: exportt.compatibleChecksum,
        });
      }
    } catch (ex) {
      console.log(ex.message);
    } finally {
      archive.popOffset(numbits, true);
    }
  }
};

module.exports = receivePropertiesForRebuild;
