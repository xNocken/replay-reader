import Replay from "../../Classes/Replay";

import { receiveNetGUIDBunch } from './receive-net-guid-bunch';
import { receivedNextBunch } from './received-next-bunch';
import { onChannelClosed } from './on-channel-closed';
import GlobalData from "../../Classes/GlobalData";
import { Bunch, Channel } from "../../../types/lib";

const maxPacketInBits = 1024 * 2 * 8;

export const receivedPacket = (packetArchive: Replay, timeSeconds: number, globalData: GlobalData) => {
  const { channels } = globalData;

  globalData.inPacketId++;

  while (!packetArchive.atEnd()) {
    if (packetArchive.header.engineNetworkVersion < 8) {
      packetArchive.skipBits(1);
    }

    const bControl = packetArchive.readBit();

    const bOpen = bControl ? packetArchive.readBit() : false;
    const bClose = bControl ? packetArchive.readBit() : false;

    let bDormant: boolean;
    let closeReason: number;

    if (packetArchive.header.engineNetworkVersion < 7) {
      bDormant = bClose ? packetArchive.readBit() : false;
      closeReason = bDormant ? 1 : 0;
    } else {
      closeReason = bClose ? packetArchive.readSerializedInt(15) : 0;
      bDormant = closeReason === 1;
    }

    const bIsReplicationPaused = packetArchive.readBit();
    const bReliable = packetArchive.readBit();

    let chIndex: number;

    if (packetArchive.header.engineNetworkVersion < 3) {
      chIndex = packetArchive.readSerializedInt(10240);
    } else {
      chIndex = packetArchive.readIntPacked();
    }

    const bHasPackageExportMaps = packetArchive.readBit();
    const bHasMustBeMappedGUIDs = packetArchive.readBit();
    const bPartial = packetArchive.readBit();

    let chSequence: number;

    if (bReliable) {
      chSequence = globalData.inReliable + 1;
    } else if (bPartial) {
      chSequence = globalData.inPacketId;
    } else {
      chSequence = 0;
    }

    const bPartialInital = bPartial ? packetArchive.readBit() : false;
    const bPartialFinal = bPartial ? packetArchive.readBit() : false;

    let chType: number;
    let chName: string;

    if (packetArchive.header.engineNetworkVersion < 6) {
      chType = (bReliable || bOpen) ? packetArchive.readSerializedInt(8) : 0;

      if (chType === 2) {
        chName = 'Actor';
      } else if (chType === 1) {
        chName = 'Control';
      } else if (chType === 4) {
        chName = 'Voice';
      }
    } else if (bReliable || bOpen) {
      chName = packetArchive.readFName();

      switch (chName) {
        case 'Control':
          chType = 1;
          break;

        case 'Voice':
          chType = 4;
          break;

        case 'Actor':
          chType = 2;
          break;
      }
    }

    chType = chType;
    chName = chName;

    const channel = channels[chIndex];

    const bunchDataBits = packetArchive.readSerializedInt(maxPacketInBits);

    const ignoreChannel = globalData.ignoredChannels[chIndex];

    let archive: Replay;

    if (ignoreChannel) {
      packetArchive.skipBits(bunchDataBits);
    } else {
      if (bPartial) {
        const bits = packetArchive.readBits(bunchDataBits);
        archive = new Replay(bits, bunchDataBits);
      } else {
        packetArchive.addOffset(3, bunchDataBits);
        archive = packetArchive;
      }

      archive.header = packetArchive.header;
    }

    const bunch: Bunch = {
      timeSeconds: timeSeconds,
      packetId: globalData.inPacketId,
      bControl,
      bOpen,
      bClose,
      bDormant,
      closeReason,
      bIsReplicationPaused,
      bReliable,
      chIndex,
      bHasPackageExportMaps,
      bHasMustBeMappedGUIDs,
      bPartial,
      chSequence,
      bPartialInital,
      bPartialFinal,
      chType,
      chName,
      bunchDataBits,
      archive,
    };

    if (bHasPackageExportMaps) {
      receiveNetGUIDBunch(archive, globalData);
    }

    if (bReliable && chSequence <= globalData.inReliable) {
      archive.popOffset(3);

      continue;
    }

    if (!channel && !bReliable && !(bOpen && (bClose || bPartial))) {
      archive.popOffset(3);

      continue;
    }

    if (!channel) {
      const newChannel: Channel = {
        chIndex: chIndex,
        channelName: chName,
        channelType: chType,
        actor: null,
      };

      channels[chIndex] = newChannel;
    }

    try {
      if (!ignoreChannel) {
        receivedNextBunch(bunch, globalData);
      } else if (bClose) {
        onChannelClosed(bunch, globalData);
      }
    } catch (ex) {
      globalData.logger.error(ex.stack);
    } finally {
      if (!bPartial && !ignoreChannel) {
        archive.popOffset(3);
      }
    }
  }
};
