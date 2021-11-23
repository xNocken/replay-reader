const NetDeltaSerializeHeader = require("./netDeltaSerializeHeader");
const receiveProperties = require("./receiveProperties");
const pathhhh = require('path');

const NetDeltaSerialize = (reader, group, bunch, enablePropertyChecksum, globalData, staticActorId) => {
  const header = NetDeltaSerializeHeader(reader);

  if (reader.isError) {
    return false;
  }

  for (let i = 0; i < header.numDeletes; i++) {
    const elementIndex = reader.readInt32();
    try {
      globalData.netDeltaEmitter.emit(
        group.customExportName || pathhhh.basename(group.pathName),
        {
          chIndex: bunch.chIndex,
          data: {
            deleted: true,
            elementIndex,
            path: group.pathName,
            export: {
              type: pathhhh.basename(group.pathName),
            },
          },
          timeSeconds: bunch.timeSeconds,
          staticActorId,
          globalData,
          result: globalData.result,
          states: globalData.states,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
        },
      );
    } catch (err) {
      console.error(`Error while exporting netDelta "${group.customExportName || pathhhh.basename(group.pathName)}": ${err.stack}`);
    }
  }

  for (let i = 0; i < header.numChanged; i++) {
    const elementIndex = reader.readInt32();

    const properties = receiveProperties(reader, group, bunch, !enablePropertyChecksum, true, globalData, staticActorId);

    if (!properties) {
      continue;
    }

    try {
      globalData.netDeltaEmitter.emit(
        properties.exportGroup.type,
        {
          chIndex: bunch.chIndex,
          data: {
            elementIndex,
            path: group.pathName,
            export: properties.exportGroup,
          },
          timeSeconds: bunch.timeSeconds,
          staticActorId,
          globalData,
          result: globalData.result,
          states: globalData.states,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
          changedProperties: properties.changedProperties,
        },
      );
    } catch (err) {
      console.error(`Error while exporting netDelta "${group.customExportName || pathhhh.basename(group.pathName)}": ${err.stack}`);
    }
  }
};

module.exports = NetDeltaSerialize;
