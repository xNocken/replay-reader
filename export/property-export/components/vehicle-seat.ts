import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, VehicleSeatComponentExport } from '$types/result-data';

export const handleVehicleSeatComponent: PropertyExportFunction<DefaultResult, DefaultStates, VehicleSeatComponentExport> = ({ actorId, data, states }) => {
  // fix for switching seats
  const enteredPlayers = [];
  const vehicle = states.vehicles[actorId];

  if (!data.PlayerSlots || !vehicle) {
    return;
  }

  data.PlayerSlots.forEach((slot, index) => {
    if (!slot) {
      return;
    }

    const oldSlot = vehicle.seats[index];

    if (slot.Player) {
      const player = states.pawns[slot.Player];

      enteredPlayers.push(slot.Player);

      if (player) {
        player.currentVehicle = vehicle;
      }
    } else if (states.pawns[oldSlot?.Player]) {
      const player = states.pawns[oldSlot.Player];

      if (player && !enteredPlayers.includes(oldSlot.Player)) {
        player.currentVehicle = null;
      }
    }

    vehicle.seats[index] = slot;
  });
};
