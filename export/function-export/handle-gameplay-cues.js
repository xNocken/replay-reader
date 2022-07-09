const handleGameplayCues = ({ actorId, data, timeSeconds, globalData, states }) => {
  if (!states.pawns[actorId]) {
    if (globalData.debug) {
      console.log('Received gameplay cue for not tracked pawn');
    }

    return;
  }

  states.pawns[actorId].gameplayCues.push({
    location: states.pawns[actorId]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};

module.exports = handleGameplayCues;
