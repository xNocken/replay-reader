const createRebuidExport = require("./createRebuildExport");

const receivePropertiesForRebuild = (archive, group, mapObjectName, bunch, globalData, subObjectInfo) => {
  const properties = [];

  const externalData = globalData.externalData[globalData.channels[bunch.chIndex].actor.actorNetGUID.value];

  delete globalData.externalData[globalData.channels[bunch.chIndex].actor.actorNetGUID.value];

  createRebuidExport(bunch, [{
    pathName: group.pathName,
    mapObjectName,
    properties,
    subObjectInfo,
    externalData: externalData ? {
      ...externalData,
      payload: Array.from(externalData.payload),
    } : undefined,
  }], globalData);

  while (true) {
    let handle = archive.readIntPacked();

    if (handle === 0) {
      break;
    }

    handle--;

    const exportt = group.netFieldExports[handle];
    const numbits = archive.readIntPacked();

    try {
      archive.addOffset(numbits);

      if (globalData.rebuildMode) {
        properties.push({
          name: exportt?.name,
          data: Array.from(archive.readBits(numbits, true)),
          size: numbits,
          compatibleChecksum: exportt?.compatibleChecksum,
          handle,
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
