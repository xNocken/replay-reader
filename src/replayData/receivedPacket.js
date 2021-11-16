const Replay = require('../Classes/Replay');
const DataBunch = require('../Classes/DataBunch');
const UChannel = require('../Classes/UChannel');
const receiveNetGUIDBunch = require('./receiveNetGUIDBunch');
const receivedNextBunch = require('./receivedNextBunch');
const onChannelClosed = require('./onChannelClosed');

/**
 *
 * @param {Replay} packetArchive
 */
const receivedPacket = (packetArchive, timeSeconds, globals) => {
  const { channels } = globals;

  globals.inPacketId++;

  while (!packetArchive.atEnd()) {
    if (packetArchive.header.EngineNetworkVersion < 8) {
      packetArchive.skipBits(1);
    }

    const bunch = {};

    bunch.timeSeconds = timeSeconds;

    const bControl = packetArchive.readBit();
    bunch.packetId = globals.inPacketId;

    bunch.bOpen = bControl ? packetArchive.readBit() : false;
    bunch.bClose = bControl ? packetArchive.readBit() : false;

    if (packetArchive.header.EngineNetworkVersion < 7) {
      bunch.bDormant = bunch.bClose ? packetArchive.readBit() : false;
      bunch.closeReason = bunch.bDormant ? 1 : 0;
    } else {
      bunch.closeReason = bunch.bClose ? packetArchive.readSerializedInt(15) : 0;
      bunch.bDormant = bunch.closeReason === 1;
    }

    bunch.bIsReplicationPaused = packetArchive.readBit();
    bunch.bReliable = packetArchive.readBit();

    if (packetArchive.header.EngineNetworkVersion < 3) {
      bunch.chIndex = packetArchive.readSerializedInt();
    } else {
      bunch.chIndex = packetArchive.readIntPacked();
    }

    bunch.bHasPackageExportMaps = packetArchive.readBit();
    bunch.bHasMustBeMappedGUIDs = packetArchive.readBit();
    bunch.bPartial = packetArchive.readBit();

    if (bunch.bReliable) {
      bunch.chSequence = globals.inReliable + 1;
    } else if (bunch.bPartial) {
      bunch.chSequence = globals.inPacketId;
    } else {
      bunch.chSequence = 0;
    }

    bunch.bPartialInital = bunch.bPartial ? packetArchive.readBit() : false;
    bunch.bPartialFinal = bunch.bPartial ? packetArchive.readBit() : false;

    let chType = 0;
    let chName = 3;

    if (packetArchive.header.EngineNetworkVersion < 6) {
      const type = packetArchive.readSerializedInt(8);
      chType = (bunch.bReliable || bunch.bOpen) ? type : 0;

      if (chType === 2) {
        chName = 2;
      } else if (chType === 1) {
        chName = 0;
      } else if (chType === 4) {
        chName = 1;
      }
    } else if (bunch.bReliable || bunch.bOpen) {
      chName = packetArchive.readFName();
      switch (chName) {
        case 'Control':
          chType = 1
          break;

        case 'Voice':
          chType = 4
          break;

        case 'Actor':
          chType = 2
          break;
      }
    }

    bunch.chType = chType;
    bunch.chName = chName;

    const channel = channels[bunch.chIndex];

    const maxPacketInBits = 1024 * 2 * 8;
    const bunchDataBits = packetArchive.readSerializedInt(maxPacketInBits);

    const ignoreChannel = globals.ignoredChannels[bunch.chIndex];

    if (ignoreChannel) {
      packetArchive.skipBits(bunchDataBits)
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
      receiveNetGUIDBunch(bunch.archive, globals);
    }

    if (bunch.bReliable && bunch.chSequence <= globals.inReliable) {
      bunch.archive.popOffset(3);

      continue;
    }

    if (!channel && !bunch.bReliable) {
      if (!(bunch.bOpen && (bunch.bClose || bunch.bPartial))) {
        bunch.archive.popOffset(3);

        continue;
      }
    }

    if (!channel) {
      const newChannel = {};

      newChannel.channelIndex = bunch.chIndex;
      newChannel.channelName = bunch.chName;
      newChannel.channelType = bunch.chType;

      channels[bunch.chIndex] = newChannel;
    }

    try {
      if (!ignoreChannel) {
        receivedNextBunch(bunch, globals);
      } else if (bunch.bClose) {
        onChannelClosed(bunch.chIndex, channel.actor, globals);
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
