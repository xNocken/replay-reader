const handleHabanero = ({chIndex,
                        data,
                        states}) => {

    const player = states.players[chIndex];
    
    if (!player) {
        return;
    }

    player.RankedRank = data;

  };
  
  module.exports = handleHabanero;
  