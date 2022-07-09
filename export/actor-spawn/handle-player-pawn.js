const handlePlayerPawnSpawn = ({ states, actorId}) => {
  const pawn = {
    damages: [],
    gameplayCues: [],
  };

  states.pawns[actorId] = pawn;
};

module.exports = handlePlayerPawnSpawn;
