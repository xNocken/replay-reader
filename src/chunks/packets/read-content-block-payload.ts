import { Bunch } from "../../../types/lib";
import GlobalData from "../../Classes/GlobalData";
import { readNetGuid } from "../../utils/read-net-guid";

const readContentBlockHeader = (bunch: Bunch, globalData: GlobalData) => {
  let bObjectDeleted = false;
  const bOutHasRepLayout = bunch.archive.readBit();
  const bIsActor = bunch.archive.readBit();
  const actor = globalData.channels[bunch.chIndex].actor;

  if (bIsActor) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: actor.archetype?.value || actor.actorNetGUID.value,
      bIsActor,
    };
  }

  const netGuid = readNetGuid(bunch.archive, false, globalData);

  const bStablyNamed = bunch.archive.readBit();

  if (bStablyNamed) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    };
  }

  const classNetGUID = readNetGuid(bunch.archive, false, globalData);

  if (classNetGUID == null || !classNetGUID.isValid()) {
    bObjectDeleted = true;

    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    };
  }

  if (bunch.archive.header.engineNetworkVersion >= 18) {
    const bActorIsOuter = bunch.archive.readBit();

    if (!bActorIsOuter) {
      readNetGuid(bunch.archive, false, globalData);
    }
  }

  return {
    bObjectDeleted,
    bOutHasRepLayout,
    repObject: classNetGUID.value,
  };
};

export const readContentBlockPayload = (bunch: Bunch, globalData: GlobalData) => {
  let { repObject, bOutHasRepLayout, bObjectDeleted, bIsActor } = readContentBlockHeader(bunch, globalData);

  if (bObjectDeleted) {
    return {
      repObject,
      bOutHasRepLayout,
      bObjectDeleted,
      numPayloadBits: 0,
    };
  }

  const numPayloadBits = bunch.archive.readIntPacked();

  return {
    repObject,
    bOutHasRepLayout,
    bObjectDeleted,
    numPayloadBits,
    bIsActor,
  };
};
