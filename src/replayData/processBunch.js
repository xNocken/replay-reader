const Actor = require('../Classes/Actor');
const DataBunch = require('../Classes/DataBunch');
const FRotator = require('../Classes/FRotator');
const FVector = require('../Classes/FVector');
const Replay = require('../Classes/Replay');
const conditionallySerializeQuantizedVector = require('./conditionallySerializeQuantizedVector');
const createRebuidExport = require('./createRebuildExport');
const internalLoadObject = require('./internalLoadObject');
const onChannelClosed = require('./onChannelClosed');
const onChannelOpened = require('./onChannelOpened');
const readContentBlockPayload = require('./readContentBlockPayload');
const receivedReplicatorBunch = require('./receivedReplicatorBunch');

/**
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

    inActor.actorNetGUID = internalLoadObject(bunch.archive, false, globalData);

    globalData.netGuidCache.addActor(inActor);

    if (bunch.archive.atEnd() && inActor.actorNetGUID.isDynamic()) {
      return;
    }

    if (inActor.actorNetGUID.isDynamic()) {
      inActor.archetype = internalLoadObject(bunch.archive, false, globalData);

      if (bunch.archive.header.EngineNetworkVersion >= 5) {
        inActor.level = internalLoadObject(bunch.archive, false, globalData);
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

    if (globalData.netGuidCache.tryGetPathName(channel.archetypeId || 0)) {
      const path = globalData.netGuidCache.tryGetPathName(channel.archetypeId || 0);

      if (playerControllerGroups.includes(path)) {
        bunch.archive.skipBytes(1);
      }
    }
  }

  if (bunch.archive.atEnd()) {
    if (globalData.rebuildMode) {
      createRebuidExport(bunch, [], globalData);
    } else {
      let exportGroup;

      if (channel.actor.actorNetGUID.isDynamic()) {
        exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(channel.actor.archetype.value, globalData)
      } else {
        exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(channel.actor.actorNetGUID.value, globalData)
      }

      if (!exportGroup) {
        return;
      }

      globalData.onActorDespawn(
        bunch.bOpen,
        bunch.chIndex,
        bunch.timeSeconds,
        exportGroup.group,
        exportGroup.mapObjectName,
        globalData
      );
    }
  }

  while (!bunch.archive.atEnd()) {
    const { repObject, bObjectDeleted, bOutHasRepLayout, numPayloadBits, subObjectInfo } = readContentBlockPayload(bunch, globalData);

    if (numPayloadBits > 0) {
      replay.addOffset(numPayloadBits);
    }

    if (bObjectDeleted) {
      if (numPayloadBits > 0) {
        replay.popOffset();
      }

      if (globalData.rebuildMode) {
        const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(repObject, globalData);

        createRebuidExport(bunch, [{
          pathName: exportGroup?.group.pathName || null,
          mapObjectName: exportGroup?.mapObjectName || null,
          subObjectInfo,
          properties: [],
        }], globalData);
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

    receivedReplicatorBunch(bunch, replay, repObject, bOutHasRepLayout, subObjectInfo, globalData);
    if (numPayloadBits > 0) {
      replay.popOffset(numPayloadBits);
    }
  }
};

module.exports = processBunch;
