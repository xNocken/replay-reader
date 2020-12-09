const PlayerEliminationEvent = require('./Classes/Events/PlayerEliminationEvent');
const Replay = require('./Classes/Replay');
const MatchStatsEvent = require('./Classes/Events/MatchStatsEvent');
const MatchTeamStatsEvent = require('./Classes/Events/MatchTeamStatsEvent');

/**
 * Parse the player
 * @param {Replay} replay the replay
 */
const parsePlayer = (replay) => {
  const playerType = replay.readByte().toString('hex');

  switch (playerType) {
    case '03':
      return "bot";

    case '10':
      return replay.readString();

    case '11':
      replay.skip(1);
      return replay.readId();

    default:
      console.log('Invalid userType', playerType);
  }
};

/**
 * Parse the player elim
 * @param {PlayerEliminationEvent} data the event
 * @param {Replay} replay the replay
 */
const parsePlayerElim = (data, replay) => {
  if (replay.header.EngineNetworkVersion >= 11 && replay.header.Major >= 9) {
    replay.skip(85);

    data.Eliminated = parsePlayer(replay);
    data.Eliminator = parsePlayer(replay);
  } else {
    if (replay.header.Major <= 4 && replay.header.Minor < 2) {
      replay.skip(12);
    }
    else if (replay.header.Major == 4 && replay.header.Minor <= 2) {
      replay.skip(40);
    }
    else {
      replay.skip(45);
    }

    data.Eliminated = replay.readString();
    data.Eliminator = replay.readString();
  }

  data.GunType = replay.readByte()[0];
  data.Knocked = replay.readBool();
};

/**
 * Parse the match stats
 * @param {MatchStatsEvent} data the event
 * @param {Replay} replay the replay
 */
const parseMatchStats = (data, replay) => {
  replay.skip(4);
  data.Accuracy = replay.readFloat32();
  data.Assists = replay.readUInt32();
  data.Eliminations = replay.readUInt32();
  data.WeaponDamage = replay.readUInt32();
  data.OtherDamage = replay.readUInt32();
  data.Revives = replay.readUInt32();
  data.DamageTaken = replay.readUInt32();
  data.DamageToStructures = replay.readUInt32();
  data.MaterialsGathered = replay.readUInt32();
  data.MaterialsUsed = replay.readUInt32();
  data.TotalTraveled = replay.readUInt32();
  data.DamageToPlayers = data.OtherDamage + data.WeaponDamage;
};

/**
 * Parse the match stats
 * @param {MatchTeamStatsEvent} data the event
 * @param {Replay} replay the replay
 */
const parseMatchTeamStats = (data, replay) => {
  replay.skip(4);
  data.Position = replay.readUInt32();
  data.TotalPlayers = replay.readUInt32();
};

/**
 * Parse the replays meta
 * @param {Replay} replay the replay
 */
const event = (replay) => {
  const eventId = replay.readString();
  const group = replay.readString();
  const metadata = replay.readString();
  const startTime = replay.readUInt32();
  const endTime = replay.readUInt32();
  const length = replay.readUInt32();

  let data = replay.decryptBuffer(length);

  let result;

  if (group === 'playerElim') {
    result = new PlayerEliminationEvent(eventId, group, metadata, startTime, endTime)
    parsePlayerElim(result, data);
  } else if (metadata === 'AthenaMatchStats') {
    result = new MatchStatsEvent(eventId, group, metadata, startTime, endTime)
    parseMatchStats(result, data);
  } else if (metadata === 'AthenaMatchTeamStats') {
    result = new MatchTeamStatsEvent(eventId, group, metadata, startTime, endTime)
    parseMatchTeamStats(result, data);
  }

  return result;
}

module.exports = event;
