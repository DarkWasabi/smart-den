const { featureCodes } = require('../features');

const androidRemote = {
  code: 'atv-remote',
  features: [featureCodes.POWER_STATE_CODE, featureCodes.REMOTE_CONTROL_CODE],
  config: ['ip', 'pairingPort', 'remotePort'],
};

module.exports = androidRemote;