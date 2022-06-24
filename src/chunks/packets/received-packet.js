const Replay = require('../../Classes/Replay');
const receiveNetGUIDBunch = require('./receive-net-guid-bunch');
const receivedNextBunch = require('./received-next-bunch');
const onChannelClosed = require('./on-channel-closed');

const maxPacketInBits = 1024 * 2 * 8;

/**
 *
 * @param {Replay} packetArchive
 */
const receivedPacket = (packetArchive, timeSeconds, globalData) => {
  const { channels } = globalData;

  globalData.inPacketId++;

  while (!packetArchive.atEnd()) {
    if (packetArchive.header.engineNetworkVersion < 8) {
      packetArchive.skipBits(1);
    }

    const bunch = {
      timeSeconds: timeSeconds,
      packetId: globalData.inPacketId,
    };

    const bControl = packetArchive.readBit();

    bunch.bOpen = bControl ? packetArchive.readBit() : false;
    bunch.bClose = bControl ? packetArchive.readBit() : false;

    if (packetArchive.header.engineNetworkVersion < 7) {
      bunch.bDormant = bunch.bClose ? packetArchive.readBit() : false;
      bunch.closeReason = bunch.bDormant ? 1 : 0;
    } else {
      bunch.closeReason = bunch.bClose ? packetArchive.readSerializedInt(15) : 0;
      bunch.bDormant = bunch.closeReason === 1;
    }

    bunch.bIsReplicationPaused = packetArchive.readBit();
    bunch.bReliable = packetArchive.readBit();

    if (packetArchive.header.engineNetworkVersion < 3) {
      bunch.chIndex = packetArchive.readSerializedInt(10240);
    } else {
      bunch.chIndex = packetArchive.readIntPacked();
    }

    bunch.bHasPackageExportMaps = packetArchive.readBit();
    bunch.bHasMustBeMappedGUIDs = packetArchive.readBit();
    bunch.bPartial = packetArchive.readBit();

    if (bunch.bReliable) {
      bunch.chSequence = globalData.inReliable + 1;
    } else if (bunch.bPartial) {
      bunch.chSequence = globalData.inPacketId;
    } else {
      bunch.chSequence = 0;
    }

    bunch.bPartialInital = bunch.bPartial ? packetArchive.readBit() : false;
    bunch.bPartialFinal = bunch.bPartial ? packetArchive.readBit() : false;

    let chType = 0;
    let chName = 3;

    if (packetArchive.header.engineNetworkVersion < 6) {
      chType = (bunch.bReliable || bunch.bOpen) ? packetArchive.readSerializedInt(8) : 0;

      if (chType === 2) {
        chName = 'Actor';
      } else if (chType === 1) {
        chName = 'Control';
      } else if (chType === 4) {
        chName = 'Voice';
      }
    } else if (bunch.bReliable || bunch.bOpen) {
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

    bunch.chType = chType;
    bunch.chName = chName;

    const channel = channels[bunch.chIndex];

    const bunchDataBits = packetArchive.readSerializedInt(maxPacketInBits);

    const ignoreChannel = globalData.ignoredChannels[bunch.chIndex];

    if (ignoreChannel) {
      packetArchive.skipBits(bunchDataBits);
    } else {
      if (bunch.bPartial) {
        const bits = packetArchive.readBits(bunchDataBits);
        bunch.archive = new Replay(bits, bunchDataBits);
      } else {
        packetArchive.addOffset(3, bunchDataBits);
        bunch.archive = packetArchive;
      }

      bunch.archive.header = packetArchive.header;
      bunch.archive.info = packetArchive.info;
    }

    if (bunch.bHasPackageExportMaps) {
      receiveNetGUIDBunch(bunch.archive, globalData);
    }

    if (bunch.bReliable && bunch.chSequence <= globalData.inReliable) {
      bunch.archive.popOffset(3);

      continue;
    }

    if (!channel && !bunch.bReliable && !(bunch.bOpen && (bunch.bClose || bunch.bPartial))) {
      bunch.archive.popOffset(3);

      continue;
    }

    if (!channel) {
      const newChannel = {
        channelIndex: bunch.chIndex,
        channelName: bunch.chName,
        channelType: bunch.chType,
      };

      channels[bunch.chIndex] = newChannel;
    }

    try {
      if (!ignoreChannel) {
        receivedNextBunch(bunch, globalData);
      } else if (bunch.bClose) {
        onChannelClosed(bunch, globalData);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      if (!bunch.bPartial && !ignoreChannel) {
        bunch.archive.popOffset(3);
      }
    }
  }
};

module.exports = receivedPacket;
