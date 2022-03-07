const Replay = require('./Classes/Replay');
const weaponTypes = require('../Enums/EFortWeaponType.json');

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

  if (info.group === 'playerElim') {
    parsePlayerElim(result, decryptedEvent);
  } else if (info.metadata === 'AthenaMatchStats') {
    parseMatchStats(result, decryptedEvent);
  } else if (info.metadata === 'AthenaMatchTeamStats') {
    parseMatchTeamStats(result, decryptedEvent);
  }

  if (!replay.info.isEncrypted) {
    replay.popOffset(1, info.length * 8);
  }

  return result;
}

module.exports = event;
