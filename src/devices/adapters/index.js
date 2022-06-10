const androidRemote = require('./androidRemote.adapter');
const adapters = {
  [androidRemote.code]: androidRemote,
};

module.exports = (code) => adapters[code];
