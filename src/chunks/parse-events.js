const enums = require('../../Enums');
const halfMapSize = 131328;

const parsePlayer = (replay) => {
  const playerType = replay.readByte();

  switch (playerType) {
    case 3:
      return "bot";

    case 16:
      return replay.readString();

    case 17:
      replay.skipBytes(1);

      return replay.readId();

    default:
      console.log('Invalid playerType', playerType, 'while reading event');
  }
};

const parsePlayerElim = (globalData, replay, time) => {
  const version = replay.readInt32();
  const targetEnum = (globalData.customEnums.EDeathCause || enums.EDeathCause);
  const result = {};

  if (version >= 3) {
    replay.skipBytes(1);

    result.eliminated = {};

    if (version >= 6) {
      result.eliminated = {
        rotation: {
          x: replay.readFloat32(),
          y: replay.readFloat32(),
          z: replay.readFloat32(),
          w: replay.readFloat32(),
        },
        location: replay.readVector(),
        scale: replay.readVector(),
      };
    }

    result.eliminator = {
      rotation: {
        x: replay.readFloat32(),
        y: replay.readFloat32(),
        z: replay.readFloat32(),
        w: replay.readFloat32(),
      },
      location: replay.readVector(),
      scale: replay.readVector(),
    };

    // TODO: verify
    if (replay.header.major >= 5) {
      result.eliminated.name = parsePlayer(replay);
      result.eliminator.name = parsePlayer(replay);
    } else {
      result.eliminated.name = replay.readString();
      result.eliminator.name = replay.readString();
    }
  } else {
    if (replay.header.major <= 4 && replay.header.minor < 2) {
      replay.skipBytes(8);
    }
    else if (replay.header.major == 4 && replay.header.minor <= 2) {
      replay.skipBytes(36);
    }
    else {
      replay.skipBytes(41);
    }

    result.eliminated = replay.readString();
    result.eliminator = replay.readString();
  }

  const gunType = replay.readByte();

  result.gunType = targetEnum[gunType];
  result.knocked = replay.readBoolean();

  let eliminator = globalData.eventData.players[result.eliminator.name];

  if (!eliminator) {
    eliminator = {
      id: result.eliminator.name,
      killScore: 0,
      positions: {},
      kills: [],
    };

    globalData.eventData.players[result.eliminator.name] = eliminator;
  }

  let eliminated = globalData.eventData.players[result.eliminated.name];

  if (!eliminated) {
    eliminated = {
      id: result.eliminated.name,
      killScore: 0,
      positions: {},
      kills: [],
    };

    globalData.eventData.players[result.eliminated.name] = eliminated;
  }

  eliminator.kills.push({
    playerId: result.eliminated.name,
    reason: result.reason,
    knocked: result.knocked,
    location: result.eliminated.location,
    time,
  });

  eliminator.positions[time] = result.eliminator.location;
  eliminated.positions[time] = result.eliminated.location;

  if (result.knocked && result.eliminated.name !== result.eliminator.name) {
    eliminator.killScore += 1;
  }

  if (result.knocked) {
    eliminated.knockInfo = {
      id: result.eliminator.name,
      time,
      reason: result.gunType,
    };
  } else {
    eliminated.elimInfo = {
      id: result.eliminator.name,
      time,
      reason: result.gunType,
    };
  }
};

const parseMatchStats = (globalData, replay) => {
  const { matchStats } = globalData.eventData;
  const version = replay.readInt32();

  matchStats.accuracy = replay.readFloat32();
  matchStats.assists = replay.readUInt32();
  matchStats.eliminations = replay.readUInt32();
  matchStats.weaponDamage = replay.readUInt32();
  matchStats.otherDamage = replay.readUInt32();
  matchStats.revives = replay.readUInt32();
  matchStats.damageTaken = replay.readUInt32();
  matchStats.damageToStructures = replay.readUInt32();
  matchStats.materialsGathered = replay.readUInt32();
  matchStats.materialsUsed = replay.readUInt32();
  matchStats.totalTraveled = replay.readUInt32();
  matchStats.damageToPlayers = matchStats.otherDamage + matchStats.weaponDamage;
};

const parseMatchTeamStats = (globalData, replay) => {
  const { matchStats } = globalData.eventData;
  const version = replay.readInt32();

  matchStats.placement = replay.readUInt32();
  matchStats.totalPlayers = replay.readUInt32();
};

const parseZoneUpdate = (globalData, replay) => {
  const version = replay.readInt32();

  globalData.eventData.safeZones.push({
    x: replay.readFloat32(),
    y: replay.readFloat32(),
    z: replay.readFloat32(),
    radius: replay.readFloat32(),
  });
};

const parseCharacterSampleMeta = (globalData, replay) => {
  const version = replay.readInt32();
  const playerAmount = replay.readInt32();

  for (let i = 0; i < playerAmount; i += 1) {
    const playerId = replay.readString();
    let player = globalData.eventData.players[playerId];

    if (!player) {
      player = {
        id: playerId,
        killScore: 0,
        positions: {},
        kills: [],
      };

      globalData.eventData.players[playerId] = player;
    }

    const positionAmount = replay.readUInt32();

    for (let i = 0; i < positionAmount; i += 1) {
      const size = replay.readInt32();
      const targetEnum = (globalData.customEnums.EFortMovementStyle || enums.EFortMovementStyle);

      const result = {
        x: replay.readInt32() - (halfMapSize >> (16 - size)),
        y: replay.readInt32() - (halfMapSize >> (16 - size)),
        z: replay.readInt32() - (halfMapSize >> (16 - size)),
        movementStyle: targetEnum[replay.readByte()],
      };

      const time = replay.readUInt16();

      player.positions[time] = result;
    }
  }
};

const parseTimecode = (globalData, replay) => {
  const version = replay.readInt32();

  globalData.eventData.timecode = replay.readDate();
};

const actorPositions = (globalData, replay) => {
  const version = replay.readInt32();
  const count = replay.readUInt32();

  for (let i = 0; i < count; i += 1) {
    const size = replay.readInt32();

    globalData.eventData.chests.push({
      x: replay.readInt32() - (halfMapSize >> (16 - size)),
      y: replay.readInt32() - (halfMapSize >> (16 - size)),
      z: replay.readInt32() - (halfMapSize >> (16 - size)),
    });
  }
};

const event = (replay, info, globalData) => {
  const startTime = Math.round(info.startTime / 1000);

  replay.goTo(info.startPos);
  let decryptedEvent = replay.decryptBuffer(info.length);

  switch (info.group) {
    case 'AthenaReplayBrowserEvents':
      if (info.metadata === 'AthenaMatchStats') {
        parseMatchStats(globalData, decryptedEvent);
      } else if (info.metadata === 'AthenaMatchTeamStats') {
        parseMatchTeamStats(globalData, decryptedEvent);
      }

      break;

    case 'playerElim':
      parsePlayerElim(globalData, decryptedEvent, startTime);

      break;

    case 'ZoneUpdate':
      parseZoneUpdate(globalData, decryptedEvent, startTime);

      break;

    case 'CharacterSample':
      parseCharacterSampleMeta(globalData, decryptedEvent, startTime);

      break;

    case 'Timecode':
      parseTimecode(globalData, decryptedEvent, startTime);

      break;

    case 'ActorsPosition':
      actorPositions(globalData, decryptedEvent, startTime);

      break;
  }

  if (!replay.info.isEncrypted) {
    replay.popOffset(1, info.length * 8);
  }
};

module.exports = event;
