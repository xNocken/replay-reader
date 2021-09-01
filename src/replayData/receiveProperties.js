const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const GlobalData = require('../utils/globalData');

/**
 * @param {Replay} archive
 * @param {NetFieldExportGroup} group
 * @param {DataBunch} bunch
 * @param {boolean} enableProperyChecksum
 * @param {boolean} netDeltaUpdate
 * @param {GlobalData} globalData
 */
const receiveProperties = (archive, group, bunch, enableProperyChecksum = true, netDeltaUpdate = false, globalData, staticActorId) => {
  let exportGroup;
  const { netFieldParser } = globalData;
  const channelIndex = bunch.chIndex;

  if (globalData.debug) {
    if (!netFieldParser.willReadType(group.pathName)) {
      return false;
    }
  }

  if (enableProperyChecksum) {
    archive.skipBits(1);
  }

  exportGroup = netFieldParser.createType(group);

  let hasData = false;

  while (true) {
    let handle = archive.readIntPacked();

    if (handle === 0) {
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

    hasData = true;

    try {
      archive.addOffset(numbits);

      if (!netFieldParser.setType(exportGroup, exportt, group, archive, globalData)) {
        exportt.incompatible = true;
      }
    } catch (ex) {
      console.log(ex.message);
    } finally {
      archive.popOffset(numbits, true);
    }
  }

  if (!netDeltaUpdate && hasData) {
    const actor = globalData.channels[bunch.chIndex].actor;
    const externalData = globalData.externalData[actor.actorNetGUID.value];

    if (externalData) {
      delete globalData.externalData[actor.actorNetGUID.value];
      const exportt = group?.netFieldExports[externalData.handle];

      if (exportt) {
        globalData.netFieldParser.setType(exportGroup, exportt, group, new Replay(externalData.payload), globalData);
      }
    }

    if (globalData.debug && !globalData.exportEmitter.eventNames().includes(exportGroup.type)) {
      console.log('Unhandled export', exportGroup.type)
    }

    globalData.exportEmitter.emit(
      exportGroup.type,
      {
        chIndex: channelIndex,
        data: exportGroup,
        timeSeconds: bunch.timeSeconds,
        staticActorId,
        globalData,
        result: globalData.result,
        states: globalData.states,
      },
    );
  }

  return exportGroup;
};

module.exports = receiveProperties;
