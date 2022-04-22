const handleLabradorLlama = ({ actorId, data, states, result, changedProperties }) => {
  if (!states.pawns[actorId]) {
    states.pawns[actorId] = data;
    result.mapData.labradorLlamas.push(data);
  }

  const currentLlama = states.pawns[actorId];

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    currentLlama[key] = data[key];
  }

  const gameplayCues = currentLlama.gameplayCues;

  if (!gameplayCues) {
    return;
  }

  const latestGameplayCueTag = gameplayCues[gameplayCues.length - 1];

  if (latestGameplayCueTag && latestGameplayCueTag.gameplayCueTag) {
    switch (latestGameplayCueTag.gameplayCueTag.tagName) {
      case 'GameplayCue.Labrador.Disappear':
        currentLlama.bIsDisappeared = true;
        break;

      case 'GameplayCue.Labrador.Leak':
        currentLlama.bIsRunning = true;
        break;

      case 'GameplayCue.Labrador.Anticipation':
        currentLlama.bIsDisappearing = true;
        break;

      default:
        break;
    }
  }
};

module.exports = handleLabradorLlama;
