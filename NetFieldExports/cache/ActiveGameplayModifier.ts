import { NetFieldExportGroupConfig } from '$types/lib';

const ActiveGameplayModifier: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.ActiveGameplayModifier",
  parseLevel: 2,
  customExportName: "activeGamplayModifier",
  exports: {
    name: "activeGameplayModifiers",
    group: "gameData",
    type: "array",
  },
  properties: {
    ModifierDef: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
  },
};

export default ActiveGameplayModifier;
