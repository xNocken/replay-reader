import { NetFieldExportGroupConfig } from '../../types/lib';

const SupplyDrop: NetFieldExportGroupConfig = {
  path: "/Game/Athena/SupplyDrops/AthenaSupplyDrop.AthenaSupplyDrop_C",
  parseLevel: 1,
  customExportName: "supplyDrop",
  exports: {
    name: "supplyDrops",
    group: "mapData",
    type: "array",
  },
  states: {
    supplyDrops: "object",
  },
  properties: {
    Opened: {
      parseFunction: "readBit",
      parseType: "default",
    },
    BalloonPopped: {
      parseFunction: "readBit",
      parseType: "default",
    },
    ReplicatedMovement: {
      type: "FRepMovement",
      parseType: "readClass",
      config: {
        locationQuatLevel: 0,
        rotationQuatLevel: 0,
        velocityQuatLevel: 0,
      },
    },
  },
};

export default SupplyDrop;
