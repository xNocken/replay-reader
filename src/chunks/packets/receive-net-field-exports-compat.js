const NetFieldExportGroup = require('../../Classes/NetFieldExportGroup');
const readNetFieldExport = require('./read-nfe');

const receiveNetFieldExportsCompat = (packet, globalData) => {
  const numLayoutCmdLayout = packet.readUInt32();

  for (let i = 0; i < numLayoutCmdLayout; i += 1) {
    const pathNameIndex = packet.readIntPacked();
    /**
     * @var {NetFieldExport} group;
     */
    let group;

    if (packet.readBit()) {
      const pathName = packet.readString();
      const numExports = packet.readUInt32();

      if (globalData.netGuidCache.NetFieldExportGroupMap[pathName]) {
        group = globalData.netGuidCache.NetFieldExportGroupMap[pathName];
      } else {
        group = new NetFieldExportGroup();

        group.pathName = pathName;
        group.pathNameIndex = pathNameIndex;
        group.netFieldExportsLength = numExports;
        group.netFieldExports = [];

        globalData.netGuidCache.addToExportGroupMap(pathName, group, globalData);
      }
    } else {
      group = globalData.netGuidCache.getNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNetFieldExport(packet);

    if (group && netField && group.isValidIndex(netField.handle)) {
      group.netFieldExports[netField.handle] = netField;
    }
  }
};

module.exports = receiveNetFieldExportsCompat;
