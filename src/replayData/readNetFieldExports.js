const Replay = require("../Classes/Replay");

/**
 * I hope i find out what it does, when its finished
 * @param {Replay} replay the replay
 */
const readNetFieldExports = (replay) => {
  const numLayoutCmdExports = replay.readIntPacked();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    throw Error('read net field exports not implemented yet');

    const pathNameIndex = replay.readIntPacked();
    const isExported = replay.readIntPacked() === 1;
    let group;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = replay.readIntPacked();

      if (netFieldExportGroupMap[pathname]) {
        group = netFieldExportGroupMap[pathname];
      } else {
        group = {
          pathname,
          pathNameIndex,
          netFieldExportsLength: numExports,
        };

        group.netFieldExports = [];
        netFieldExportGroupMap[pathname] = group;
      }
    } else {

    }
  }
}

module.exports = readNetFieldExports;
