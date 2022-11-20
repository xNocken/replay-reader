import { NetFieldExportGroupConfig } from '../../types/nfe';

const LabradorLlama: NetFieldExportGroupConfig = {
  path: "/Labrador/Pawn/BP_AIPawn_Labrador.BP_AIPawn_Labrador_C",
  parseLevel: 1,
  customExportName: "labrador",
  states: {
    labradorLlamas: "object",
  },
  exports: {
    name: "labradorLlamas",
    group: "mapData",
    type: "array",
  },
  properties: {
    ReplicatedMovement: {
      type: "FRepMovement",
      parseType: "readClass",
    },
    bIsHiddenForDeath: {
      parseFunction: "readBit",
      parseType: "default",
    },
    PawnUniqueID: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    NPC_AlertLevel: {
      type: "EAlertLevel",
      parseType: "readEnum",
      bits: 3,
    },
  },
};

export default LabradorLlama;
