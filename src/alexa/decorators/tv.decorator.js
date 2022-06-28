const { Device, Feature } = require('../../models');
const { powerState, remoteControl } = require('../../devices/features')

/**
 * @param {Feature} feature
 */
const decorateCapability = (feature) => {
  switch (feature.code) {
    case powerState.code:
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
    case remoteControl.code:
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
 */
const decorate = (device) => {
  const capabilities = [{
    type: 'AlexaInterface',
    interface: 'Alexa',
    version: '3',
  }];

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
