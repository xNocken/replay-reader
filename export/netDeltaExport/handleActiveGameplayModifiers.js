const handleActiveGameplayModifiers = (hIndex, update, timeSeconds, staticActorId, globalData) => {
  globalData.result.gameData.activeGameplayModifiers.push(update.export.ModifierDef?.name);
};

module.exports = handleActiveGameplayModifiers;
