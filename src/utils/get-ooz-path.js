const getOozPath = () => {
  switch (process.platform) {
    case 'win32':
      return `${__dirname}/../../oo2core_8_win64.dll`;

    case 'linux':
      return `${__dirname}/../../liblinoodle.so`;

    default:
      throw new Error('Your platform is not supported');
  }
};

module.exports = getOozPath;
