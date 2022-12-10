const Joi = require('joi');
const { objectId } = require('./custom.validation');
const deviceTypes = Object.values(require('../config/deviceTypes'));
const adapters = Object.keys(require('../devices/adapters'));

const createDevice = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required().valid(...deviceTypes),
    adapter: Joi.object().required().keys({
      code: Joi.string().required().valid(...adapters),
      config: Joi.object(),
    }),
  }),
};

const getHomeDevices = {
  params: Joi.object().keys({
    homeId: Joi.string().custom(objectId),
  }),
};

const getDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().custom(objectId),
  }),
};

const updateDevice = {
  params: Joi.object().keys({
    deviceId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
    })
    .min(1),
};

const deleteDevice = {
  params: Joi.object().keys({
    deviceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDevice,
  getDevice,
  updateDevice,
  deleteDevice,
  getHomeDevices,
};
