import { NetFieldExportGroupConfig } from '../../types/nfe';

const SafeZoneIndicator: NetFieldExportGroupConfig = {
  path: "/Game/Athena/SafeZone/SafeZoneIndicator.SafeZoneIndicator_C",
  parseLevel: 1,
  customExportName: "safeZone",
  exports: {
    name: "safeZones",
    group: "gameData",
    type: "array",
  },
  states: {
    safeZones: "object",
  },
  properties: {
    PreviousRadius: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    LastRadius: {
      customExportName: "PreviousRadius",
      parseFunction: "readFloat32",
      parseType: "default",
    },
    NextRadius: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    PreviousCenter: {
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
    LastCenter: {
      customExportName: "PreviousCenter",
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
    NextCenter: {
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
    NextNextCenter: {
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
    SafeZoneStartShrinkTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    SafeZoneFinishShrinkTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    Radius: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
  },
};

export default SafeZoneIndicator;
