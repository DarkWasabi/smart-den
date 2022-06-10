const { Device, Feature } = require('../../models');
const { featureCodes } = require('../../devices/features')

/**
 * @param {Feature} feature
 * @returns {Object}
 */
const decorateCapability = (feature) => {
  console.log(feature);

  switch (feature.code) {
    case featureCodes.POWER_STATE_CODE:
      return {
        type: 'AlexaInterface',
        interface: 'Alexa.PowerController',
        version: '3',
        properties: {
          supported: [
            {
              name: 'powerState',
            },
          ],
          proactivelyReported: true,
          retrievable: true,
        },
      };
    case featureCodes.REMOTE_CONTROL_CODE:
      return {
        type: 'AlexaInterface',
        interface: 'Alexa.KeypadController',
        version: '3',
        keys: [
          "BACK",
          "INFO", "MORE", "SELECT",
          "UP", "DOWN", "LEFT", "RIGHT",
          "PAGE_UP", "PAGE_DOWN", "PAGE_LEFT", "PAGE_RIGHT",
        ],
      };
    default:
      throw new Error('Invalid feature');
  }
};

/**
 * @param {Device} device
 * @returns {Object}
 */
const decorate = (device) => {
  const capabilities = [{
    type: 'AlexaInterface',
    interface: 'Alexa',
    version: '3',
  }];
  console.log(device.features);
  device.features.forEach(feature => capabilities.push(decorateCapability(feature)));

  return {
    endpointId: device.id,
    manufacturerName: device.manufacturer || 'JARVIS',
    description: device.description || 'JARVIS',
    friendlyName: device.name,
    displayCategories: [device.type],
    capabilities,
  };
};

module.exports = decorate;
