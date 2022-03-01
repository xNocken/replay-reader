const handleClientInfoHitMarkers = ({ data, changedProperties, states, actor }) => {
  const actorId = actor.actorNetGUID.value;

  const clientInfo = states.remoteClientInfo[actorId];

  if (!clientInfo) {
    return;
  }

  if (data.ScreenSpaceHitLocations) {
    clientInfo.hitMarkers.push(data.ScreenSpaceHitLocations);
  }
};

module.exports = handleClientInfoHitMarkers;
