import { NetFieldExportGroupConfig } from '$types/lib';

const DamageCues: NetFieldExportGroupConfig = {
  path: [
    "/Script/FortniteGame.FortPawn:NetMulticast_Athena_BatchedDamageCues",
    "/Script/FortniteGame.FortPlayerPawnAthena:NetMulticast_Athena_BatchedDamageCues",
  ],
  customExportName: "batchedDamageCue",
  parseLevel: 3,
  properties: {
    Location: {
      parseFunction: "readPackedVector10",
      parseType: "default",
    },
    Normal: {
      parseFunction: "readPackedVector10",
      parseType: "default",
    },
    Magnitude: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bWeaponActivate: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsFatal: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsCritical: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsShield: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsShieldDestroyed: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsShieldApplied: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsBallistic: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsBeam: {
      parseFunction: "readBit",
      parseType: "default",
    },
    NonPlayerbIsFatal: {
      parseFunction: "readBit",
      parseType: "default",
    },
    NonPlayerbIsCritical: {
      parseFunction: "readBit",
      parseType: "default",
    },
    HitActor: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    NonPlayerHitActor: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default DamageCues;
