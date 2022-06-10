const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const deviceValidation = require('../../validations/device.validation');
const deviceController = require('../../controllers/device.controller');

const router = express.Router();

router
  .route('/local-devices')
  .get(auth(), deviceController.getLocalDevices);

router
  .route('/:deviceId')
  .get(auth(), validate(deviceValidation.getDevice), deviceController.getDevice)
  .delete(auth(), validate(deviceValidation.deleteDevice), deviceController.deleteDevice);

module.exports = router;

// TODO: add @swagger