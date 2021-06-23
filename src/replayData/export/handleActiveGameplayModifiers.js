const handleActiveGameplayModifiers = (chIndex, state, timeSeconds, globalData) => {
  const modifiers = globalData.result.gameData.activeGameplayModifiers;

  modifiers[modifiers.length] = state.export.ModifierDef?.name;
};

module.exports = handleActiveGameplayModifiers;
