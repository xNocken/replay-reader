const Replay = require('./Classes/Replay');
const weaponTypes = require('../Enums/EFortWeaponType.json');
const halfMapSize = 131328;

/**
 * Parse the player
 * @param {Replay} replay the replay
 */
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

/**
 * Parse the player elim
 * @param {object} result the event
 * @param {Replay} replay the replay
 */
const parsePlayerElim = (result, replay) => {
  const version = replay.readInt32();

  result.version = version;

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
    }

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

  result.gunType = weaponTypes[gunType] || gunType;
  result.knocked = replay.readBoolean();
};

/**
 * Parse the match stats
 * @param {object} data the event
 * @param {Replay} replay the replay
 */
const parseMatchStats = (data, replay) => {
  data.version = replay.readInt32();
  data.accuracy = replay.readFloat32();
  data.assists = replay.readUInt32();
  data.eliminations = replay.readUInt32();
  data.weaponDamage = replay.readUInt32();
  data.otherDamage = replay.readUInt32();
  data.revives = replay.readUInt32();
  data.damageTaken = replay.readUInt32();
  data.damageToStructures = replay.readUInt32();
  data.materialsGathered = replay.readUInt32();
  data.materialsUsed = replay.readUInt32();
  data.totalTraveled = replay.readUInt32();
  data.damageToPlayers = data.otherDamage + data.weaponDamage;
};

/**
 * Parse the match stats
 * @param {object} data the event
 * @param {Replay} replay the replay
 */
const parseMatchTeamStats = (data, replay) => {
  data.version = replay.readInt32();
  data.position = replay.readUInt32();
  data.totalPlayers = replay.readUInt32();
};

const parseZoneUpdate = (data, replay) => {
  data.version = replay.readInt32();
  data.x = replay.readFloat32();
  data.y = replay.readFloat32();
  data.z = replay.readFloat32();
  data.radius = replay.readFloat32();
};

const parseCharacterSampleMeta = (data, replay) => {
  data.version = replay.readInt32();
  data.players = [];

  const playerAmount = replay.readInt32();

  for (let i = 0; i < playerAmount; i += 1) {
    const player = {
      playerId: replay.readString(),
      positions: [],
    };

    const positionAmount = replay.readUInt32();

    for (let i = 0; i < positionAmount; i += 1) {
      const size = replay.readInt32();

      player.positions.push({
        x: replay.readInt32() - (halfMapSize >> (16 - size)),
        y: replay.readInt32() - (halfMapSize >> (16 - size)),
        z: replay.readInt32() - (halfMapSize >> (16 - size)),
        movementType: replay.readByte(),
        time: replay.readUInt16(),
      });
    }

    data.players.push(player);
  }
};

const parseTimecode = (data, replay) => {
  data.version = replay.readInt32();
  data.timecode = new Date(parseInt((replay.readUInt64() - 621355968000000000n) / 10000n, 10));
}

const actorPositions = (data, replay) => {
  data.version = replay.readInt32();
  data.count = replay.readUInt32();
  data.positions = [];

  for (let i = 0; i < data.count; i += 1) {
    const size = replay.readInt32();

    data.positions.push({
      x: replay.readInt32() - (halfMapSize >> (16 - size)),
      y: replay.readInt32() - (halfMapSize >> (16 - size)),
      z: replay.readInt32() - (halfMapSize >> (16 - size)),
    })
  }
}

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 */
const event = (replay, info) => {
  replay.goTo(info.startPos);
  let decryptedEvent = replay.decryptBuffer(info.length);
  const result = {
    eventId: info.eventId,
    group: info.group,
    metadata: info.metadata,
  };

  switch (info.group) {
    case 'AthenaReplayBrowserEvents':
      if (info.metadata === 'AthenaMatchStats') {
        parseMatchStats(result, decryptedEvent);
      } else if (info.metadata === 'AthenaMatchTeamStats') {
        parseMatchTeamStats(result, decryptedEvent);
      }

      break;

    case 'playerElim':
      parsePlayerElim(result, decryptedEvent);

      break;

    case 'ZoneUpdate':
      parseZoneUpdate(result, decryptedEvent);

      break;

    case 'CharacterSample':
      parseCharacterSampleMeta(result, decryptedEvent);

      break;

    case 'Timecode':
      parseTimecode(result, decryptedEvent);

      break;

    case 'ActorsPosition':
      actorPositions(result, decryptedEvent);

      break;
  }

  if (!replay.info.isEncrypted) {
    replay.popOffset(1, info.length * 8);
  }

  return result;
}

module.exports = event;
