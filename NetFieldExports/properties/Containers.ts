import { NetFieldExportGroupConfig } from '../../types/nfe';

const Containers: NetFieldExportGroupConfig = {
  path: [
    "/Game/Building/ActorBlueprints/Containers/Tiered_Chest_Athena.Tiered_Chest_Athena_C",
    "/Game/Building/ActorBlueprints/Containers/Tiered_Ammo_Athena.Tiered_Ammo_Athena_C",
  ],
  customExportName: "container",
  parseLevel: 2,
  exports: {
    name: "containers",
    group: "mapData",
    type: "array",
  },
  states: {
    containers: "object",
  },
  staticActorIds: ["Tiered_Chest_Athena", "Tiered_Ammo_Athena"],
  properties: {
    bHidden: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bAlreadySearched: {
      parseFunction: "readBit",
      parseType: "default",
    },
    ReplicatedLootTier: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    SearchingPawn: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default Containers;
