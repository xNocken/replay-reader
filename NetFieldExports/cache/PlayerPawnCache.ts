import { NetFieldExportGroupConfig } from '../../types/lib';

const PlayerPawnCache: NetFieldExportGroupConfig = {
  path: [
    "PlayerPawn_Athena_C_ClassNetCache",
    "BP_PlayerPawn_Athena_Phoebe_C_ClassNetCache",
    "BP_AIPawn_Labrador_C_ClassNetCache",
  ],
  parseLevel: 1,
  type: "classNetCache",
  properties: {
    NetMulticast_InvokeGameplayCueAdded_WithParams: {
      type: "gameplayCue",
      parseType: "function",
    },
    NetMulticast_InvokeGameplayCueExecuted_WithParams: {
      type: "gameplayCue",
      parseType: "function",
    },
    NetMulticast_InvokeGameplayCueExecuted_FromSpec: {
      type: "gameplayCue",
      parseType: "function",
    },
    NetMulticast_Athena_BatchedDamageCues: {
      type: "batchedDamageCue",
      parseType: "function",
    },
  },
};

export default PlayerPawnCache;
