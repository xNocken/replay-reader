const NetBitReader = require('../Classes/NetBitReader');
const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const { channels, netFieldParser } = require('../utils/globalData');
const onExportRead = require('./export/onExportRead');

/**
 *
 * @param {NetBitReader} archive
 * @param {NetFieldExportGroup} group
 * @param {number} channelIndex
 * @param {boolean} enableProperyChecksum
 * @param {boolean} netDeltaUpdate
 */
const receiveProperties = (archive, group, channelIndex, enableProperyChecksum = true, netDeltaUpdate = false) => {
  let exportGroup;

  if (channels[channelIndex].isIgnoringChannel(group.pathName)) {
    return false;
  }

  if (!netFieldParser.willReadType(group.pathName)) {
    channels[channelIndex].ignoreChannel(group.pathName);

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

      netFieldParser.readField(exportGroup, exportt, handle, group, cmdReader);

      if (cmdReader.isError || cmdReader.atEnd() || archive.atEnd()) {
        break;
      }
    } catch (ex) {
      console.log(ex.message);
    }
  }

  if (!netDeltaUpdate && hasData) {
    onExportRead(channelIndex, exportGroup);
  }

  return true;
};

module.exports = receiveProperties;
