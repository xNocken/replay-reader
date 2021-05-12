const FortSet = require('../../../Classes/FortSet');

const createFortSet = (handle, value) => {
  const fortset = new FortSet();

  fortset.BaseValue = value[handle]?.getValueAsFloat();
  fortset.CurrentValue = value[handle + 1]?.getValueAsFloat();
  fortset.Maximum = value[handle + 3]?.getValueAsFloat();
  fortset.UnclampedBaseValue = value[handle + 7]?.getValueAsFloat();
  fortset.UnclampedCurrentValue = value[handle + 8]?.getValueAsFloat();

  return fortset;
};

const handleHealthSet = (chIndex, value, timeseconds, globalData) => {
  const player = globalData.players[chIndex];

  if (!player) {
    return;
  }

  const startingHandles = Object.entries(value).filter(([, a]) => a.name === 'Maximum');

  if (startingHandles[0]) {
    const healthStartHandle = parseInt(startingHandles[0][0]) - 3;

    player.health = createFortSet(healthStartHandle, value);
  }

  if (startingHandles[1]) {
    const shieldStartHandle = parseInt(startingHandles[1][0]) - 3;

    player.shield = createFortSet(shieldStartHandle, value);
  }
};

module.exports = handleHealthSet;
