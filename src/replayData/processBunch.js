const Actor = require('../Classes/Actor');
const DataBunch = require('../Classes/DataBunch');
const FRotator = require('../Classes/FRotator');
const FVector = require('../Classes/FVector');
const netGuidCache = require('../utils/netGuidCache');
const conditionallySerializeQuantizedVector = require('./conditionallySerializeQuantizedVector');
const internalLoadObject = require('./internalLoadObject');
const onChannelOpened = require('./onChannelOpened');
const readContentBlockPayload = require('./readContentBlockPayload');
const receivedReplicatorBunch = require('./receivedReplicatorBunch');

/**
 *
 * @param {DataBunch} bunch
 */
const processBunch = (bunch, replay, globalData) => {
  const { channels, playerControllerGroups } = globalData;
  const channel = channels[bunch.chIndex];

  if (channel && !channel.actor) {
    if (!bunch.bOpen) {
      return;
    }

    const inActor = {};

    inActor.actorNetGUID = internalLoadObject(bunch.archive, false);

    netGuidCache.addActor(inActor);

    if (bunch.archive.atEnd() && inActor.actorNetGUID.isDynamic()) {
      return;
    }

    if (inActor.actorNetGUID.isDynamic()) {
      inActor.archetype = internalLoadObject(bunch.archive, false);

      if (bunch.archive.header.EngineNetworkVersion >= 5) {
        inActor.level = internalLoadObject(bunch.archive, false);
      }

      inActor.location = conditionallySerializeQuantizedVector(bunch.archive, { x: 0, y: 0, z: 0 });

      if (bunch.archive.readBit()) {
        inActor.rotation = bunch.archive.readRotationShort();
      } else {
        inActor.rotation = { pitch: 0, yaw: 0, roll: 0 };
      }

      inActor.scale = conditionallySerializeQuantizedVector(bunch.archive, { x: 1, y: 1, z: 1 });
      inActor.velocity = conditionallySerializeQuantizedVector(bunch.archive, { x: 0, y: 0, z: 0 });
    }

    channel.actor = inActor;

    onChannelOpened(bunch.chIndex, inActor.actorNetGUID, globalData);
    if (netGuidCache.tryGetPathName(channel.archetypeId || 0)) {
      const path = netGuidCache.tryGetPathName(channel.archetypeId || 0);

      if (playerControllerGroups.includes(path)) {
        bunch.archive.readByte();
      }
    }
  }

  while (!bunch.archive.atEnd()) {
    const { repObject, bObjectDeleted, bOutHasRepLayout, numPayloadBits } = readContentBlockPayload(bunch, globalData);

    if (numPayloadBits > 0) {
      replay.addOffset(numPayloadBits);
    }

    if (bObjectDeleted) {
      if (numPayloadBits > 0) {
        replay.popOffset();
      }

      continue;
    }

    if (bunch.archive.isError) {
      if (numPayloadBits > 0) {
        replay.popOffset();
      }

      break;
    }

    if (!repObject || !numPayloadBits) {
      if (numPayloadBits > 0) {
        replay.popOffset();
      }

      continue;
    }

    receivedReplicatorBunch(bunch, replay, repObject, bOutHasRepLayout, globalData);
    if (numPayloadBits > 0) {
      replay.popOffset();
    }
  }
};

module.exports = processBunch;
