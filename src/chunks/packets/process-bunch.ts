import { Actor, Bunch } from "../../../types/lib";

import { serializeQuantizedVector } from '../../utils/serialize-quantized-vector';
import { readNetGuid } from '../../utils/read-net-guid';
import { onChannelClosed } from './on-channel-closed';
import { onChannelOpened } from './on-channel-opened';
import { readContentBlockPayload } from './read-content-block-payload';
import { receivedReplicatorBunch } from './received-replicator-bunch';
import GlobalData from "../../Classes/GlobalData";
import EEngineNetworkCustomVersion from '../../versions/EEngineNetworkCustomVersion';

export const processBunch = (bunch: Bunch, globalData: GlobalData) => {
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

    const inActor: Actor = {
      actorNetGUID: readNetGuid(bunch.archive, false, globalData),
    };

    globalData.netGuidCache.addActor(inActor);

    if (inActor.actorNetGUID.isDynamic()) {
      if (replay.atEnd()) {
        return;
      }

      inActor.archetype = readNetGuid(bunch.archive, false, globalData);

      if (globalData.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.NewActorOverrideLevel) {
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

    onChannelOpened(channel, inActor, bunch, globalData);

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
