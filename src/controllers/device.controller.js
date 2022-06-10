const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { deviceService } = require('../services');

const getDevice = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  res.send(device);
});

const deleteDevice = catchAsync(async (req, res) => {
  await deviceService.deleteDeviceById(req.params.deviceId);

  res.status(httpStatus.NO_CONTENT).send();
});

const getLocalDevices = catchAsync(async (req, res) => {
  const devices = await deviceService.getLocalDevices();

  res.send(devices);
});

module.exports = {
  getDevice,
  getLocalDevices,
  deleteDevice,
};
