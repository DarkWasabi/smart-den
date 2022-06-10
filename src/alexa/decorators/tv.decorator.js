const { v4: uuid } = require('uuid');

const decorate = (device) => {
  return {
    event: {
      header: {
        namespace: 'Alexa.Discovery',
        name: 'Discover.Response',
        payloadVersion: '3',
        messageId: uuid(),
      },
      payload: {
        endpoints: [
          {
            endpointId: device.id,
            manufacturerName: device.manufacturer,
            description: device.description,
            friendlyName: device.displayName,
            displayCategories: ['TV'],
            capabilities: [
              {
                type: 'AlexaInterface',
                interface: 'Alexa.KeypadController',
                version: '3',
                keys: ['BACK', 'INFO', 'MORE', 'SELECT', 'UP', 'DOWN', 'LEFT', 'RIGHT'],
              },
              {
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
              },
              {
                type: 'AlexaInterface',
                interface: 'Alexa',
                version: '3',
              },
            ],
          },
        ],
      },
    },
  };
};

module.exports = decorate;
