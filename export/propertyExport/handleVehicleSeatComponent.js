const handleVehicleSeatComponent = ({ actorId, data, states }) => {
  if (data.PlayerSlots && states.vehicles[actorId]) {
    // fix for switching seats
    const enteredPlayers = [];

    data.PlayerSlots.forEach((slot, index) => {
      if (!slot) {
        return;
      }

      const oldSlot = states.vehicles[actorId].seats[index];

      if (slot.Player) {
        const player = states.pawns[slot.Player];

        enteredPlayers.push(slot.Player);

        if (player) {
          player.currentVehicle = states.vehicles[actorId];
        }
      } else if (states.pawns[oldSlot?.Player]) {
        const player = states.pawns[oldSlot.Player];

        if (player && !enteredPlayers.includes(oldSlot.Player)) {
          player.currentVehicle = null;
        }
      }

      states.vehicles[actorId].seats[index] = slot;
    });
  }
};

module.exports = handleVehicleSeatComponent;
