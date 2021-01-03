const NetBitReader = require('../Classes/NetBitReader');
const DataBunch = require('../Classes/DataBunch');
const UChannel = require('../Classes/UChannel');
const recieveNetGUIDBunch = require('./recieveNetGUIDBunch');
const { channels } = require('../utils/globalData');
const recievedRawBunch = require('./recievedRawBunch');

let inPacketId = 0;
let inReliable = 0;
let bunchIndex = 0;

/**
 *
 * @param {NetBitReader} packetArchive
 */
const recievedPacket = (packetArchive) => {
  const OLD_MAX_ACTOR_CHANNELS = 10240;

  inPacketId++;

  while (!packetArchive.atEnd()) {
    if (packetArchive.header.EngineNetworkVersion < 8) {
      var isAckDummy = packetArchive.readBit();
    }

    const bunch = new DataBunch()

    const bControl = packetArchive.readBit();
    bunch.packetId = inPacketId;

    if (bunch.packetId === 166) {
      console.log();
    }
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
      bunch.chSequence = inReliable + 1;
    } else if (bunch.bPartial) {
      bunch.chSequence = inPacketId;
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
    } else if (bunch.bReliable ||bunch.bOpen) {
      chName = packetArchive.readFName();
      let hi;
      // TODO: chType

    }

    bunch.chType = chType;
    bunch.chName = chName;

    const channel = channels[bunch.chIndex] != null;

    const maxPacket = 1024 * 2;
    const bunchDataBits = packetArchive.readSerializedInt(maxPacket * 8);
    const bits = packetArchive.readBits(bunchDataBits);
    bunch.archive = new NetBitReader(bits, bunchDataBits);

    bunch.archive.header = packetArchive.header;
    bunch.archive.info = packetArchive.info;

    bunchIndex++;

    if (bunch.bHasPackageExportMaps) {
      recieveNetGUIDBunch(bunch.archive);
    }

    if (channel && false) {
      'ähm'
    }

    if (bunch.bReliable && bunch.chSequence <= inReliable) {
      continue;
    }

    if (!channel && !bunch.bReliable) {
      if (!(bunch.bOpen && (bunch.bClose || bunch.bPartial))) {
        continue;
      }
    }

    if (!channel) {
      const newChannel = new UChannel();

      newChannel.channelIndex = bunch.chIndex;
      newChannel.channelName = bunch.chName;
      newChannel.channelType = bunch.chType;

      channels[bunch.chIndex] = newChannel;

      try {
        recievedRawBunch(bunch);
      } catch (ex) {
        console.log(ex);
      }
    }
  }
};

module.exports = recievedPacket;
