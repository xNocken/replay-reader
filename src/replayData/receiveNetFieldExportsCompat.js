const NetBitReader = require('../Classes/NetBitReader');
const netGuidCache = require('../utils/netGuidCache');
const readNetFieldExport = require('./readNetFieldExport');

/**
 * @param {NetBitReader} packet
 */
const receiveNetFieldExportsCompat = (packet) => {
  const numLayoutCmdLayout = packet.readUInt32();

  for (let i = 0; i < numLayoutCmdLayout; i++) {
    const pathNameIndex = packet.readIntPacked();
    /**
     * @var {NetFieldExport} group;
     */
    let group;

    if (packet.readBit()) {
      const pathName = packet.readString();
      const numExports = packet.readUInt32();

      if (netGuidCache.NetFieldExportGroupMap[pathName]) {
        group = netGuidCache.NetFieldExportGroupMap[pathName];
      } else {
        group = new NetFieldExportGroup();
        group.pathName = pathName;
        group.pathNameIndex = pathNameIndex;
        group.netFieldExportsLength = numExports;

        group.netFieldExports = [];
        netGuidCache.addToExportGroupMap(pathName, group);
      }
    } else {
      group = netGuidCache.getNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNetFieldExport(packet);

    if (group != null && group.isValidIndex(netField.handle)) {
      group.netFieldExports[netField.handle] = netField;
    }
  }
};

module.exports = receiveNetFieldExportsCompat;
