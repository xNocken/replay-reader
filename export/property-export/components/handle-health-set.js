let healthStartHandle;
let shieldStartHandle;
let overShieldStartHandle;
let lastExportAmount = 0;

const hasDataInSet = (handle, value) => value[handle]
  || value[handle + 1]
  || value[handle + 3];

const createFortSet = (handle, value, oldValues) => {
  const fortset = {};

  fortset.BaseValue = value[handle] !== undefined ? value[handle] :  oldValues?.BaseValue;
  fortset.CurrentValue = value[handle + 1] !== undefined ? value[handle + 1] :  oldValues?.CurrentValue;
  fortset.Maximum = value[handle + 3] !== undefined ? value[handle + 3] :  oldValues?.Maximum;

  return fortset;
};

const handleHealthSet = ({ actorId, data, states, netFieldExports }) => {
  const player = states.players[actorId];

  if (!player) {
    return;
  }

  const nfeLength = netFieldExports.filter(Boolean).length;

  if (lastExportAmount !== nfeLength) {
    const startingHandles = netFieldExports.filter((a) => a.name === 'Maximum');

    healthStartHandle = startingHandles[0].handle - 3;
    shieldStartHandle = startingHandles[1].handle - 3;

    if (startingHandles[2]) {
      overShieldStartHandle = startingHandles[2].handle - 3;
    }

    lastExportAmount = nfeLength;
  }

  if (hasDataInSet(healthStartHandle, data)) {
    player.health = createFortSet(healthStartHandle, data, player.health);
  }

  if (hasDataInSet(shieldStartHandle, data)) {
    player.shield = createFortSet(shieldStartHandle, data, player.shield);
  }

  if (overShieldStartHandle && hasDataInSet(overShieldStartHandle, data)) {
    player.overShield = createFortSet(overShieldStartHandle, data, player.overShield);
  }
};

module.exports = handleHealthSet;
