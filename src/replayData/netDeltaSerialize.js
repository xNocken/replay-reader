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
  }

  for (let i = 0; i < header.numChanged; i++) {
    const elementIndex = reader.readInt32();

    const exportGroup = receiveProperties(reader, group, bunch, !enablePropertyChecksum, true, globalData, staticActorId);

    if (!exportGroup) {
      continue;
    }

    globalData.netDeltaEmitter.emit(
      exportGroup.type,
      {
        chIndex: bunch.chIndex,
        data: {
          elementIndex,
          path: group.pathName,
          export: exportGroup,
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
  }
};

module.exports = NetDeltaSerialize;
