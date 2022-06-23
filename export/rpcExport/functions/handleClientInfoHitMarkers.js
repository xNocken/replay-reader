const handleClientInfoHitMarkers = ({ data, states, actorId }) => {
  const clientInfo = states.remoteClientInfo[actorId];

  if (!clientInfo) {
    return;
  }

  if (data.ScreenSpaceHitLocations) {
    clientInfo.hitMarkers.push(data.ScreenSpaceHitLocations);
  }
};

module.exports = handleClientInfoHitMarkers;
