import { FortSet, PropertyExportFunction } from '../../../types/lib';
import { DefaultResult, DefaultStates, HealthSetExport } from '../../../types/result-data';

let healthStartHandle: number;
let shieldStartHandle: number;
let overShieldStartHandle: number;
let lastExportAmount = 0;

const hasDataInSet = (handle: number, value: HealthSetExport) => value[handle] !== undefined
  || value[handle + 1] !== undefined
  || value[handle + 3] !== undefined;

const createFortSet = (handle: number, value: HealthSetExport, oldValues: FortSet | null) => {
  const fortset: FortSet = {
    BaseValue: value[handle] !== undefined ? value[handle] :  oldValues?.BaseValue,
    CurrentValue: value[handle + 1] !== undefined ? value[handle + 1] :  oldValues?.CurrentValue,
    Maximum: value[handle + 3] !== undefined ? value[handle + 3] :  oldValues?.Maximum,
  };

  return fortset;
};

export const handleHealthSet: PropertyExportFunction<DefaultResult, DefaultStates, HealthSetExport> = ({ actorId, data, states, netFieldExports }) => {
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
