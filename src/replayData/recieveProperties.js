const DataBunch = require('../Classes/DataBunch');
const NetBitReader = require('../Classes/NetBitReader');
const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const GlobalData = require('../utils/globalData');
const onExportRead = require('./export/onExportRead');
const fs = require('fs');

/**
 *
 * @param {NetBitReader} archive
 * @param {NetFieldExportGroup} group
 * @param {DataBunch} bunch
 * @param {boolean} enableProperyChecksum
 * @param {boolean} netDeltaUpdate
 * @param {GlobalData} globalData
 */
const receiveProperties = (archive, group, bunch, enableProperyChecksum = true, netDeltaUpdate = false, globalData) => {
  let exportGroup;
  const { channels, netFieldParser } = globalData;
  const channelIndex = bunch.chIndex;

  if (channels[channelIndex].isIgnoringChannel(group.pathName)) {
    return false;
  }

  if (!netFieldParser.willReadType(group.pathName)) {
    channels[channelIndex].ignoreChannel(group.pathName);

    if (globalData.debug) {
      fs.appendFileSync('notReadingGroups.txt', group.pathName +'\n');

      group.netFieldExports.forEach((exporttt) =>  {
        fs.appendFileSync('notReadingGroups.txt', '    ' + exporttt.name + '\n');
      });
    }

    return false;
  }

  if (enableProperyChecksum) {
    const doChecksum = archive.readBit();
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
      const cmdReader = new NetBitReader(archive.readBits(numbits), numbits);

      cmdReader.header = archive.header;
      cmdReader.info = archive.info;

      if (!netFieldParser.readField(exportGroup, exportt, handle, group, cmdReader)) {
        exportt.incompatible = true;
      }
    } catch (ex) {
      console.log(ex.message);
    }
  }

  if (!netDeltaUpdate && hasData) {
    if (globalData.onExportRead) {
      globalData.onExportRead(channelIndex, exportGroup, bunch.timeSeconds, globalData);
    } else {
      onExportRead(channelIndex, exportGroup, bunch.timeSeconds, globalData);
    }
  }

  return true;
};

module.exports = receiveProperties;
