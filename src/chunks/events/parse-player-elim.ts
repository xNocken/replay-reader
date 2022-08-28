import { ElimPlayer } from '$types/events';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

import enums from '../../../Enums';
import parsePlayer from './util/parse-player';
import { BaseResult, BaseStates } from '$types/lib';

export const parsePlayerElim = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay, time: number) => {
  const version = replay.readInt32();
  const targetEnum = (globalData.options.customEnums?.EDeathCause || enums.EDeathCause);

  let eliminated: ElimPlayer;
  let eliminator: ElimPlayer;

  if (version >= 3) {
    replay.skipBytes(1);

    if (version >= 6) {
      eliminated = {
        rotation: {
          x: replay.readFloat32(),
          y: replay.readFloat32(),
          z: replay.readFloat32(),
          w: replay.readFloat32(),
        },
        location: replay.readVector(),
        scale: replay.readVector(),
        name: null,
      };
    }

    eliminator = {
      rotation: {
        x: replay.readFloat32(),
        y: replay.readFloat32(),
        z: replay.readFloat32(),
        w: replay.readFloat32(),
      },
      location: replay.readVector(),
      scale: replay.readVector(),
      name: null,
    };

    // TODO: verify
    if (replay.header.major >= 5) {
      eliminated.name = parsePlayer(replay);
      eliminator.name = parsePlayer(replay);
    } else {
      eliminated.name = replay.readString();
      eliminator.name = replay.readString();
    }
  } else {
    if (replay.header.major <= 4 && replay.header.minor < 2) {
      replay.skipBytes(8);
    }
    else if (replay.header.major == 4 && replay.header.minor <= 2) {
      replay.skipBytes(36);
    }
    else {
      replay.skipBytes(41);
    }

    eliminated = {
      name: replay.readString(),
    };

    eliminator = {
      name: replay.readString(),
    };
  }

  const reason = targetEnum[replay.readByte()];
  const knocked = replay.readBoolean();

  let globalEliminator = globalData.eventData.players[eliminator.name];

  if (!globalEliminator) {
    globalEliminator = {
      id: eliminator.name,
      killScore: 0,
      positions: {},
      kills: [],
    };

    globalData.eventData.players[eliminator.name] = globalEliminator;
  }

  let globalEliminated = globalData.eventData.players[eliminated.name];

  if (!globalEliminated) {
    globalEliminated = {
      id: eliminated.name,
      killScore: 0,
      positions: {},
      kills: [],
    };

    globalData.eventData.players[eliminated.name] = globalEliminated;
  }

  globalEliminator.kills.push({
    playerId: eliminated.name,
    knocked: knocked,
    location: eliminated.location,
    reason,
    time,
  });

  globalEliminator.positions[time] = eliminator.location;
  globalEliminated.positions[time] = eliminated.location;

  if (knocked && eliminated.name !== eliminator.name) {
    globalEliminator.killScore += 1;
  }

  if (knocked) {
    globalEliminated.knockInfo = {
      id: eliminator.name,
      time,
      reason: reason,
    };
  } else {
    globalEliminated.elimInfo = {
      id: eliminator.name,
      time,
      reason: reason,
    };
  }
}
