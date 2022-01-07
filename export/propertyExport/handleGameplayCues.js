const handleGameplayCues = ({ actor, data, timeSeconds, result, states }) => {
  const actorId = actor.actorNetGUID.value;

  if (!result.gameData.gameplayCues[actorId]) {
    result.gameData.gameplayCues[actorId] = [];
    states.gameplayCues[actorId] = result.gameData.gameplayCues[actorId];
  }

  result.gameData.gameplayCues[actorId].push({
    location: states.players[states.pawnChannelToStateChannel[actorId]]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};

module.exports = handleGameplayCues;
