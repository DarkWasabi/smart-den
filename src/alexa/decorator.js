const { v4: uuid } = require('uuid');
const decorators = require('./decorators');

/**
 * @param {Device} device
 */
const decorateEndpoint = (device) => {
  const decorator = decorators[device.type];
  console.log(decorator);
  if (!decorator) {
    throw new Error(`Invalid device type ${device.type}`);
  }
  return decorator(device);
};

/**
 * @param {Device[]} devices
 */
const discovery = (devices) => {
  const endpoints = devices.map((device) => decorateEndpoint(device))

  return {
    event: {
      header: {
        namespace: 'Alexa.Discovery',
        name: 'Discover.Response',
        payloadVersion: '3',
        messageId: uuid(),
      },
      payload: {
        endpoints,
      }
    }
  }
}

module.exports = {
  discovery,
};
