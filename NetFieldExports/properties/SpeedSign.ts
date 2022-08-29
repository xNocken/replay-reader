import { NetFieldExportGroupConfig } from '$types/lib';

const SpeedSign: NetFieldExportGroupConfig = {
  path: "/Game/Athena/Environments/Blueprints/BP_Athena_SpeedSign.BP_Athena_SpeedSign_C",
  parseLevel: 3,
  customExportName: "speedSign",
  exports: {
    name: "speedSigns",
    group: "mapData",
    type: "array",
  },
  states: {
    speedSigns: "object",
  },
  staticActorIds: ["BP_Athena_SpeedSign"],
  properties: {
    VehicleSpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bReplicateMovement: {
      parseFunction: "readBit",
      parseType: "default",
    },
    ReplicatedMovement: {
      type: "FRepMovement",
      parseType: "readClass",
      config: {
        locationQuatLevel: 0,
      },
    },
  },
};

export default SpeedSign;