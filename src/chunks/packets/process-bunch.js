const serializeQuantizedVector = require('../../utils/serialize-quantized-vector');
const readNetGuid = require('../../utils/read-net-guid');
const onChannelClosed = require('./on-channel-closed');
const onChannelOpened = require('./on-channel-opened');
const readContentBlockPayload = require('./read-content-block-payload');
const receivedReplicatorBunch = require('./received-replicator-bunch');

const processBunch = (bunch, globalData) => {
  const replay = bunch.archive;
  const { channels, playerControllerGroups } = globalData;
  const channel = channels[bunch.chIndex];

  if (bunch.bHasMustBeMappedGUIDs) {
    const numMusteBeMappedGUIDs = replay.readUInt16();

    for (let i = 0; i < numMusteBeMappedGUIDs; i++) {
      replay.readIntPacked();
    }
  }

  if (channel && !channel.actor) {
    if (!bunch.bOpen) {
      return;
    }

    const inActor = {};

    inActor.actorNetGUID = readNetGuid(bunch.archive, false, globalData);

    globalData.netGuidCache.addActor(inActor);

    if (inActor.actorNetGUID.isDynamic()) {
      if (replay.atEnd()) {
        return;
      }

      inActor.archetype = readNetGuid(bunch.archive, false, globalData);

      if (bunch.archive.header.engineNetworkVersion >= 5) {
        inActor.level = readNetGuid(bunch.archive, false, globalData);
      }

      inActor.location = serializeQuantizedVector(bunch.archive, { x: 0, y: 0, z: 0 });

      if (bunch.archive.readBit()) {
        inActor.rotation = bunch.archive.readRotationShort();
      } else {
        inActor.rotation = { pitch: 0, yaw: 0, roll: 0 };
      }

      inActor.scale = serializeQuantizedVector(bunch.archive, { x: 1, y: 1, z: 1 });
      inActor.velocity = serializeQuantizedVector(bunch.archive, { x: 0, y: 0, z: 0 });
    }

    channel.actor = inActor;

    onChannelOpened(bunch.chIndex, inActor, globalData);

    if (globalData.netGuidCache.tryGetPathName(channel.actor?.archetype?.value || 0)) {
      const path = globalData.netGuidCache.tryGetPathName(channel.actor?.archetype?.value || 0);

      if (playerControllerGroups.includes(path)) {
        bunch.archive.readByte();
      }
    }
  }

  bunch.actor = channel.actor;

  while (!bunch.archive.atEnd()) {
    const {
      repObject,
      bObjectDeleted,
      bOutHasRepLayout,
      numPayloadBits,
      bIsActor,
    } = readContentBlockPayload(bunch, globalData);

    if (numPayloadBits > 0) {
      replay.addOffset(4, numPayloadBits);
    }

    if (bObjectDeleted) {
      if (numPayloadBits > 0) {
        replay.popOffset(4);
      }

      continue;
    }

    if (bunch.archive.isError) {
      if (numPayloadBits > 0) {
        replay.popOffset(4);
      }

      break;
    }

    if (!repObject || !numPayloadBits) {
      if (numPayloadBits > 0) {
        replay.popOffset(4);
      }

      continue;
    }

    receivedReplicatorBunch(bunch, replay, repObject, bOutHasRepLayout, bIsActor, globalData);

    if (numPayloadBits > 0) {
      replay.popOffset(4);
    }
  }

  if (bunch.bClose) {
    onChannelClosed(bunch, globalData);
  }
};

module.exports = processBunch;
