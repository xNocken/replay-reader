const handleActiveGameplayModifiers = (state, globalData) => {
  globalData.result.gameData.activeGameplayModifiers.push(state.export.ModifierDef?.name);
};

module.exports = handleActiveGameplayModifiers;
