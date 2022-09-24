import { PlayerPosition } from '../../../types/events';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';
import enums from '../../../Enums';
import { parsePosition } from './util/parse-position';

export const parseCharacterSampleMeta = (globalData: GlobalData, replay: Replay) => {
  const playerAmount = replay.readInt32();

  for (let i = 0; i < playerAmount; i += 1) {
    const playerId = replay.readString();
    let player = globalData.eventData.players[playerId];

    if (!player) {
      player = {
        id: playerId,
        killScore: 0,
        positions: {},
        kills: [],
      };

      globalData.eventData.players[playerId] = player;
    }

    const positionAmount = replay.readUInt32();

    for (let i = 0; i < positionAmount; i += 1) {
      const targetEnum = (globalData.options.customEnums?.EFortMovementStyle || enums.EFortMovementStyle);

      const result: PlayerPosition = {
        ...parsePosition(replay),
        movementType: targetEnum[replay.readByte()],
      };

      const time = replay.readUInt16();

      player.positions[time] = result;
    }
  }
};
