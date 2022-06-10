const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createHome = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string(),
  }),
};

const getHome = {
  params: Joi.object().keys({
    homeId: Joi.string().custom(objectId),
  }),
};

const updateHome = {
  params: Joi.object().keys({
    homeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      address: Joi.string(),
    })
    .min(1),
};

const deleteHome = {
  params: Joi.object().keys({
    homeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createHome,
  getHome,
  updateHome,
  deleteHome,
};
