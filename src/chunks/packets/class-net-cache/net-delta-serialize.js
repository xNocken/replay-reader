const receiveProperties = require("../receive-properties");
const pathhhh = require('path');

const netDeltaSerialize = (reader, group, bunch, enablePropertyChecksum, globalData, staticActorId) => {
  const exportName = group.customExportName || pathhhh.basename(group.pathName);

  if (reader.header.engineNetworkVersion >= 11 && !reader.readBit()) {
    return false;
  }

  const header = {
    arrayReplicationKey: reader.readInt32(),
    baseReplicationKey: reader.readInt32(),
    numDeletes: reader.readInt32(),
    numChanged: reader.readInt32(),
  };

  if (reader.isError) {
    return false;
  }

  for (let i = 0; i < header.numDeletes; i++) {
    const elementIndex = reader.readInt32();

    try {
      globalData.emitters.netDelta.emit(
        exportName,
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
          actor: bunch.actor,
          actorId: bunch.actor.actorNetGUID.value,
        },
      );
    } catch (err) {
      console.error(`Error while exporting netDelta "${exportName}": ${err.stack}`);
    }
  }

  for (let i = 0; i < header.numChanged; i++) {
    const elementIndex = reader.readInt32();

    const properties = receiveProperties(
      reader,
      group,
      bunch,
      !enablePropertyChecksum,
      true,
      globalData,
      staticActorId,
    );

    if (!properties || !properties.changedProperties.length) {
      continue;
    }

    try {
      globalData.emitters.netDelta.emit(
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
          actor: bunch.actor,
          actorId: bunch.actor.actorNetGUID.value,
        },
      );
    } catch (err) {
      console.error(`Error while exporting netDelta "${group.customExportName || pathhhh.basename(group.pathName)}": ${err.stack}`);
    }
  }
};

module.exports = netDeltaSerialize;
