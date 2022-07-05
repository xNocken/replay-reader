const handlePlayerPawnSpawn = ({ states, actorId}) => {
  const pawn = {
    damages: [],
  };

  states.pawns[actorId] = pawn;
};

module.exports = handlePlayerPawnSpawn;
