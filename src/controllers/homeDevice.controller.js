const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeService, deviceService } = require('../services');

const addDevice = catchAsync(async (req, res) => {
  const device = await homeService.addHomeDeviceById(req.params.homeId, req.body);

  res.status(httpStatus.CREATED).send(device);
});

const getDevices = catchAsync(async (req, res) => {
  const devices = await deviceService.getDevicesByHomeId(req.params.homeId);

  res.send(devices);
});

module.exports = {
  addDevice,
  getDevices
};
