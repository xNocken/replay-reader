const handleGameplayCues = ({ actor, data, timeSeconds, globalData, states }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.pawns[actorId]) {
    if (globalData.debug) {
      console.log('Received gameplay cue for not tracked pawn');
    }

    return;
  }

  if (!states.pawns[actorId].gameplayCues) {
    states.pawns[actorId].gameplayCues = [];
  }

  states.pawns[actorId].gameplayCues.push({
    location: states.pawns[actorId]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};

module.exports = handleGameplayCues;
