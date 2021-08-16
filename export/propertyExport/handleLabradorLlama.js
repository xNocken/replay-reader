const handleLabradorLlama = ({ chIndex, data, states, result }) => {
  if (!states.labradorLlamas[chIndex]) {
    states.labradorLlamas[chIndex] = data;
    result.mapData.labradorLlamas.push(data);
  }

  const currentLlama = states.labradorLlamas[chIndex];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      currentLlama[key] = value;
    }
  });

  const gameplayCues = states.gameplayCues[chIndex];

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
