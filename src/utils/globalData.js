const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const UChannel = require('../Classes/UChannel');

const getNewProxy = (initialData = {}) => {
  const data = {
    ...initialData,
    length: Object.keys(initialData).length,
  };

  data.toJSON = () => ({ ...data, length: undefined});

  return new Proxy(data, {
    get: (target, key) => {
      if (target[key] === undefined) {
        target[key] = getNewProxy();

        target.length += 1;
      }

      return target[key];
    },
    set: (target, key, val) => {
      target[key] = val;

      target.length += 1;
    }
  });
};

class GlobalData {
  constructor(overrideConfig = {}) {
    /**
     * @type {Array<UChannel>}
     */
    this.channels = [];
    this.playerControllerGroups = [
      "BP_ReplayPC_Athena_C"
    ];
    this.netFieldExports = {};
    /**
     * @type {DataBunch}
     */
    this.partialBunch = null;
    this.parseLevel = 1;
    this.inReliable = 0;
    this.players = {};
    this.actorToChannel = [];
    this.channelToActor = [];
    this.pawnChannelToStateChannel = [];
    this.queuedPlayerPawns = [];
    this.pickups = {};
    this.result = getNewProxy();
    this.workData = getNewProxy();
    this.onExportRead = null;
    this.netFieldExportPath = null;
    this.onlyUseCustomNetFieldExports = false;

    this.debug = false;

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);
  }
}

module.exports = GlobalData;
