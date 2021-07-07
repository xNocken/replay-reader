const handleActiveGameplayModifiers = require("./handleActiveGameplayModifiers");

const onNetDeltaRead = (chIndex, update, timeSeconds, mapObjectName, globalData) => {
  switch (update.export.type) {
    case 'FortniteGame.ActiveGameplayModifier':
      handleActiveGameplayModifiers(chIndex, update, timeSeconds, globalData);
      break;

    default:
      console.log('got unused netDeltaExport', update.export.type);
  }
};

module.exports = onNetDeltaRead;
