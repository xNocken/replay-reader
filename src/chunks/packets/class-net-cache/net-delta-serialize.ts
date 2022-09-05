import { receiveProperties } from "../receive-properties";
import pathhhh from 'path';
import Replay from '../../../Classes/Replay';
import { BaseResult, BaseStates, Bunch, Data, NetDeltaExport } from '../../../../types/lib';
import GlobalData from '../../../Classes/GlobalData';
import { NetFieldExportGroupInternal } from '../../../../types/replay';

export const netDeltaSerialize = (
  reader: Replay,
  group: NetFieldExportGroupInternal,
  bunch: Bunch,
  enablePropertyChecksum: boolean,
  globalData: GlobalData,
  staticActorId: string,
) => {
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
      const exportData: NetDeltaExport<BaseResult, BaseStates, Data> = {
        chIndex: bunch.chIndex,
        data: {
          deleted: true,
          elementIndex,
          path: group.pathName,
          changedProperties: [],
          export: {
            type: exportName,
            pathName: group.pathName,
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
        logger: globalData.logger,
      };

      globalData.emitters.netDelta.emit(exportName, exportData);
    } catch (err) {
      globalData.logger.error(`Error while exporting netDelta "${exportName}": ${err.stack}`);
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
      const exportData: NetDeltaExport<BaseResult, BaseStates, Data> = {
        chIndex: bunch.chIndex,
        data: {
          elementIndex,
          path: group.pathName,
          export: properties.exportGroup,
          changedProperties: properties.changedProperties,
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
        logger: globalData.logger,
      };

      globalData.emitters.netDelta.emit(properties.exportGroup.type, exportData);
    } catch (err) {
      globalData.logger.error(`Error while exporting netDelta "${exportName}": ${err.stack}`);
    }
  }
};
