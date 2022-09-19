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
      console.log('Invalid userType', playerType);
  }
};

/**
 * Parse the player elim
 * @param {object} result the event
 * @param {Replay} replay the replay
 */
const parsePlayerElim = (result, replay) => {
  if (replay.header.EngineNetworkVersion >= 11 && replay.header.Major >= 9) {
    if (replay.header.EngineNetworkVersion >= 23) {
      replay.skipBytes(5 + (80 * 2));
    } else {
      replay.skipBytes(85);
    }

    result.eliminated = parsePlayer(replay);
    result.eliminator = parsePlayer(replay);
  } else {
    if (replay.header.Major <= 4 && replay.header.Minor < 2) {
      replay.skipBytes(12);
    }
    else if (replay.header.Major == 4 && replay.header.Minor <= 2) {
      replay.skipBytes(40);
    }
    else {
      replay.skipBytes(45);
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
  replay.skipBytes(4);
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
  data.something = replay.readInt32();
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
    ...info,
  };

  if (info.group === 'playerElim') {
    parsePlayerElim(result, decryptedEvent);
  } else if (info.metadata === 'AthenaMatchStats') {
    parseMatchStats(result, decryptedEvent);
  } else if (info.metadata === 'AthenaMatchTeamStats') {
    parseMatchTeamStats(result, decryptedEvent);
  }

  if (!replay.info.IsEncrypted) {
    replay.popOffset(1, info.length * 8);
  }

  return result;
}

module.exports = event;
