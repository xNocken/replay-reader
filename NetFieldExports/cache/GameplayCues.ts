import { NetFieldExportGroupConfig } from '../../types/nfe';

const GameplayCues: NetFieldExportGroupConfig = {
  path: [
    "/Script/FortniteGame.FortPawn:NetMulticast_InvokeGameplayCueAdded_WithParams",
    "/Script/FortniteGame.FortPawn:NetMulticast_InvokeGameplayCueExecuted_WithParams",
    "/Script/FortniteGame.FortPawn:NetMulticast_InvokeGameplayCueExecuted_FromSpec",
  ],
  customExportName: "gameplayCue",
  states: {
    gameplayCues: "object",
  },
  parseLevel: 2,
  properties: {
    GameplayCueTag: {
      type: "FGameplayTag",
      parseType: "readClass",
    },
  },
};

export default GameplayCues;
