import { ElimPlayer } from '../../../types/events';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

import parsePlayer from './util/parse-player';
import { isNonZeroPos } from '../../utils/is-non-zero-pos';

export const parsePlayerElim = (globalData: GlobalData, replay: Replay, time: number, version: number) => {
  const EDeathCause = globalData.netFieldParser.getEnum('EDeathCause');

  let eliminated: ElimPlayer = {
    name: null,
  };
  let eliminator: ElimPlayer;

  if (version >= 3) {
    replay.skipBytes(1);

    if (version >= 6) {
      eliminated.rotation = replay.readVector4d();
      eliminated.location = replay.readVector3d();
      eliminated.scale = replay.readVector3d();
    }

    eliminator = {
      rotation: replay.readVector4d(),
      location: replay.readVector3d(),
      scale: replay.readVector3d(),
      name: null,
    };

    if (replay.header.major >= 9) {
      eliminated.name = parsePlayer(replay, globalData.logger);
      eliminator.name = parsePlayer(replay, globalData.logger);
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

  const reason = EDeathCause[replay.readByte()];
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

  const eliminatedPosValid = eliminated.location && isNonZeroPos(eliminated.location);
  const eliminatorPosValid = eliminator.location && isNonZeroPos(eliminator.location);

  globalEliminator.kills.push({
    playerId: eliminated.name,
    knocked: knocked,
    location: eliminatedPosValid ? eliminated.location : null,
    reason,
    time,
  });

  if (eliminatorPosValid) {
    globalEliminator.positions[time] = eliminator.location;
  }

  if (eliminatedPosValid) {
    globalEliminated.positions[time] = eliminated.location;
  }

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
