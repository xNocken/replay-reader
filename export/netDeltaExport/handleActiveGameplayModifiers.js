const handleActiveGameplayModifiers = ({ data, result, changedProperties }) => {
  result.gameData.activeGameplayModifiers.push(data.export.ModifierDef?.name);
};

module.exports = handleActiveGameplayModifiers;
