const handleActiveGameplayModifiers = ({ data, result }) => {
  result.gameData.activeGameplayModifiers.push(data.export.ModifierDef?.name);
};

module.exports = handleActiveGameplayModifiers;
