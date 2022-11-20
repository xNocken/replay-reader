import { NetFieldExportGroupConfig } from '../../types/nfe';

const Llama: NetFieldExportGroupConfig = {
  path: "/Game/Athena/SupplyDrops/Llama/AthenaSupplyDrop_Llama.AthenaSupplyDrop_Llama_C",
  parseLevel: 1,
  customExportName: "llama",
  exports: {
    name: "llamas",
    group: "mapData",
    type: "array",
  },
  states: {
    llamas: "object",
  },
  properties: {
    Looted: {
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

export default Llama;
