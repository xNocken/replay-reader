const handleLabradorLlama = (chIndex, value, timeseconds, mapObjectName, globalData) => {
  if (!globalData.labradorLlamas[chIndex]) {
    globalData.labradorLlamas[chIndex] = value;
  }

  const currentLlama = globalData.labradorLlamas[chIndex];

  Object.entries(value).forEach(([key, value]) => {
    if (value !== null) {
      currentLlama[key] = value;
    }
  });

  const gameplayCues = globalData.result.gameData.gameplayCues[chIndex];

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
