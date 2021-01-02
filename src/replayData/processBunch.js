const Actor = require('../Classes/Actor');
const DataBunch = require('../Classes/DataBunch');
const FRotator = require('../Classes/FRotator');
const FVector = require('../Classes/FVector');
const { channels, playerControllerGroups } = require('../utils/globalData');
const netGuidCache = require('../utils/netGuidCache');
const conditionallySerializeQuantizedVector = require('./conditionallySerializeQuantizedVector');
const internalLoadObject = require('./internalLoadObject');
const readContentBlockPayload = require('./readContentBlockPayload');

/**
 *
 * @param {DataBunch} bunch
 */
const processBunch = (bunch) => {
  const channel = channels[bunch.chIndex];
  const actor = channel.actor != null;

  if (!actor) {
    if (!bunch.bOpen) {
      return;
    }

    const inActor = new Actor();

    inActor.actorNetGUID = internalLoadObject(bunch.archive, false);

    if (bunch.archive.atEnd() && inActor.actorNetGUID.isDynamic()) {
      return;
    }

    if (inActor.actorNetGUID.isDynamic()) {
      inActor.archetype = internalLoadObject(bunch.archive, false);

      if (bunch.archive.header.EngineNetworkVersion >= 5) {
        inActor.level = internalLoadObject(bunch.archive, false);
      }

      inActor.location = conditionallySerializeQuantizedVector(bunch.archive, new FVector(0, 0, 0));

      if (bunch.archive.readBit()) {
        inActor.rotation = bunch.archive.readRotationShort();
      } else {
        inActor.rotation = new FRotator(0, 0, 0);
      }

      inActor.scale = conditionallySerializeQuantizedVector(bunch.archive, new FVector(1, 1, 1));
      inActor.velocity = conditionallySerializeQuantizedVector(bunch.archive, new FVector(0, 0, 0));
    }

    channel.actor = inActor;

    onChannelOpened(channel.ChannelIndex, inActor.actorNetGUID);

    if (netGuidCache.tryGetPathName(channel.archetype || 0)) {
      const path = netGuidCache.tryGetPathName(channel.archetype || 0);

      if (playerControllerGroups[path]) {
        bunch.archive.readByte();
      }
    }
  }

  while (!bunch.archive.atEnd()) {
    const { repObject, bObjectDeleted, bHasRepLayout, reader } = readContentBlockPayload(bunch);

    if (bObjectDeleted) {
      continue;
    }

    if (bunch.archive.isError) {
      break;
    }

    if (repObject === 0 || reader === null || reader.atEnd()) {
      continue;
    }

    if (recievedReplicatorBunch(bunch, reader, repObject, bHasRepLayout)) {
      continue;
    }
  }
};
