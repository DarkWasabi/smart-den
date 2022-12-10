const POWER_STATE_CODE = 'powerState';
const REMOTE_CONTROL_CODE = 'remoteControl';

const powerState = {
  code: POWER_STATE_CODE,
  name: 'Power State',
  type: Boolean,
}

const remoteControl = {
  code: REMOTE_CONTROL_CODE,
  name: 'Remote Control',
  type: null,
};

module.exports = {
  powerState,
  remoteControl,
};

module.exports.featureCodes = {
  POWER_STATE_CODE,
  REMOTE_CONTROL_CODE,
};
