const handleActiveGameplayModifiers = (hIndex, update, timeSeconds, mapObjectName, globalData) => {
  globalData.result.gameData.activeGameplayModifiers.push(update.export.ModifierDef?.name);
};

module.exports = handleActiveGameplayModifiers;
