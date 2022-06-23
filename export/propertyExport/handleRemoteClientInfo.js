const handleRemoteClientInfo = ({ states, data, actorId, changedProperties }) => {
  let remoteClientInfo = states.remoteClientInfo[actorId];

  if (!remoteClientInfo) {
    remoteClientInfo = {
      actorId,
      hitMarkers: [],
    };

    states.remoteClientInfo[actorId] = remoteClientInfo;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    remoteClientInfo[key] = data[key];
  }
};

module.exports = handleRemoteClientInfo;
