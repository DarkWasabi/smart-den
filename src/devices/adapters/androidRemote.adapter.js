const { powerState, remoteControl } = require('../features');
const makeProcess = require('./services/androidRemote.service')

const androidRemote = {
  code: 'atv-remote',
  features: [powerState, remoteControl].map(feature => feature.code),
  config: ['ip', 'pairingPort', 'remotePort'],
  makeProcess,
};

module.exports = androidRemote;