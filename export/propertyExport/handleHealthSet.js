const FortSet = require('../../Classes/FortSet');

let healthStartHandle;
let shieldStartHandle;

const hasDataInSet = (handle, value) => value[handle]
  || value[handle + 1]
  || value[handle + 3]
  || value[handle + 7]
  || value[handle + 8];

const createFortSet = (handle, value) => {
  const fortset = {};

  fortset.BaseValue = value[handle]?.getValueAsFloat();
  fortset.CurrentValue = value[handle + 1]?.getValueAsFloat();
  fortset.Maximum = value[handle + 3]?.getValueAsFloat();
  fortset.UnclampedBaseValue = value[handle + 7]?.getValueAsFloat();
  fortset.UnclampedCurrentValue = value[handle + 8]?.getValueAsFloat();

  return fortset;
};

const handleHealthSet = ({ chIndex, data, states }) => {
  const player = states.players[chIndex];

  if (!player) {
    return;
  }

  if (healthStartHandle === undefined) {
    const startingHandles = Object.entries(data).filter(([, a]) => a.name === 'Maximum');

    healthStartHandle = parseInt(startingHandles[0][0], 10) - 3;
    shieldStartHandle = parseInt(startingHandles[1][0], 10) - 3;
  }

  if (hasDataInSet(healthStartHandle, data)) {
    player.health = createFortSet(healthStartHandle, data);
  }

  if (hasDataInSet(shieldStartHandle, data)) {
    player.shield = createFortSet(shieldStartHandle, data);
  }
};

module.exports = handleHealthSet;
