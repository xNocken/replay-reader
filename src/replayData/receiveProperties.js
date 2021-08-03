const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const GlobalData = require('../utils/globalData');
const fs = require('fs');
const receivePropertiesForRebuild = require('./receivePropertiesForRebuild');

/**
 * @param {Replay} archive
 * @param {NetFieldExportGroup} group
 * @param {DataBunch} bunch
 * @param {boolean} enableProperyChecksum
 * @param {boolean} netDeltaUpdate
 * @param {GlobalData} globalData
 */
const receiveProperties = (archive, group, bunch, enableProperyChecksum = true, netDeltaUpdate = false, globalData, subObjectInfo, mapObjectName) => {
  const { channels, netFieldParser } = globalData;
  const channelIndex = bunch.chIndex;

  if (channels[channelIndex].isIgnoringChannel(group.pathName) && !globalData.rebuildMode) {
    return false;
  }

  if (!netFieldParser.willReadType(group.pathName) && !globalData.rebuildMode) {
    channels[channelIndex].ignoreChannel(group.pathName);

    if (globalData.debug) {
      fs.appendFileSync('notReadingGroups.txt', group.pathName + '\n');

      Object.values(group.netFieldExports).forEach((exporttt) => {
        fs.appendFileSync('notReadingGroups.txt', '    ' + exporttt.name + '\n');
      });
    }

    return false;
  }

  if (enableProperyChecksum) {
    archive.skipBits(1);
  }

  if (globalData.rebuildMode && !netDeltaUpdate) {
    receivePropertiesForRebuild(archive, group, mapObjectName, bunch, globalData, subObjectInfo);

    return true;
  }

  const exportGroup = netFieldParser.createType(group);

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

      if (!netFieldParser.readField(exportGroup, exportt, handle, group, archive, globalData)) {
        exportt.incompatible = true;
      }
    } catch (ex) {
      console.log(ex.stack);
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

      globalData.netFieldParser.readField(exportGroup, exportt, 0, group, new Replay(externalData.payload), globalData);
    }

    globalData.onExportRead(channelIndex, exportGroup, bunch.timeSeconds, mapObjectName, globalData);
  }

  return exportGroup;
};

module.exports = receiveProperties;
