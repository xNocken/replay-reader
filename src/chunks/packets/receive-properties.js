const Replay = require('../../Classes/Replay');

/**
 * @param {Replay} archive
 * @param {NetFieldExportGroup} group
 * @param {boolean} enableProperyChecksum
 * @param {boolean} netDeltaUpdate
 * @param {GlobalData} globalData
 */
const receiveProperties = (
  archive,
  group,
  bunch,
  enableProperyChecksum = true,
  netDeltaUpdate = false,
  globalData,
  staticActorId,
) => {
  const { netFieldParser } = globalData;
  const channelIndex = bunch.chIndex;

  if (globalData.debug && !netFieldParser.willReadType(group.pathName)) {
    return false;
  }

  if (enableProperyChecksum) {
    archive.skipBits(1);
  }

  const exportGroup = netFieldParser.createType(group);

  let changedProperties = [];

  while (true) {
    let handle = archive.readIntPacked();

    if (!handle) {
      break;
    }

    handle--;

    if (!group.isValidIndex(handle)) {
      return false;
    }

    const exportt = group?.netFieldExports[handle];
    const numbits = archive.readIntPacked();

    if (numbits == 0) {
      continue;
    }

    if (!exportt) {
      archive.skipBits(numbits);

      continue;
    }

    if (exportt.incompatible) {
      archive.skipBits(numbits);

      continue;
    }

    try {
      archive.addOffset(6, numbits);

      if ((group.parseUnknownHandles && !exportt.parseType) || group.storeAsHandle || exportt.storeAsHandle) {
        changedProperties.push(exportt.handle);
      } else {
        changedProperties.push(exportt.name);
      }

      if (!netFieldParser.setType(exportGroup, exportt, group, archive, globalData)) {
        exportt.incompatible = true;
      }
    } catch (ex) {
      console.log(ex.stack);
    } finally {
      archive.popOffset(6, numbits, true);
    }
  }

  if (!netDeltaUpdate && changedProperties.length) {
    const actor = bunch.actor;
    const externalData = globalData.externalData[actor.actorNetGUID.value];

    if (externalData) {
      delete globalData.externalData[actor.actorNetGUID.value];
      const exportt = group?.netFieldExports[externalData.handle];

      if (exportt) {
        const payloadReader = new Replay(externalData.payload);

        payloadReader.header = archive.header;

        globalData.netFieldParser.setType(exportGroup, exportt, group, payloadReader, globalData);
        exportGroup[`${exportt.name}_encrypted`] = externalData.isEncrypted;
      }
    }

    if (globalData.debug && !globalData.emitters.export.eventNames().includes(exportGroup.type)) {
      console.log('Unhandled export', exportGroup.type);
    }

    try {
      globalData.emitters.export.emit(
        exportGroup.type,
        {
          chIndex: channelIndex,
          data: exportGroup,
          timeSeconds: bunch.timeSeconds,
          staticActorId,
          globalData,
          result: globalData.result,
          states: globalData.states,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
          changedProperties,
          actor: bunch.actor,
          actorId: bunch.actor.actorNetGUID.value,
          netFieldExports: group.netFieldExports,
        },
      );
    } catch (err) {
      console.error(`Error while exporting propertyExport "${exportGroup.type}": ${err.stack}`);
    }
  }

  return { exportGroup, changedProperties };
};

module.exports = receiveProperties;
