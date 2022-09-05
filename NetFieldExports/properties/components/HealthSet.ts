import { NetFieldExportGroupConfig } from '../../../types/lib';

const HealthSet: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortRegenHealthSet",
  customExportName: "healthSet",
  parseLevel: 1,
  storeAsHandle: true,
  redirects: ["HealthSet"],
  properties: {
    BaseValue: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    CurrentValue: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    Maximum: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
  },
};

export default HealthSet;
