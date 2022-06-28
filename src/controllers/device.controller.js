const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { deviceService } = require('../services');
const { getProcess } = require('../devices/adapters');

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

const getState = catchAsync(async (req, res) => {
  // TODO: move to device.service.js
  const device = await deviceService.getDeviceStateByCode(req.params.deviceId, req.params.code);

  res.send(device);
});

const setState = catchAsync(async (req, res) => {
  // TODO: move to device.service.js
  const device = await deviceService.getDeviceStateByCode(req.params.deviceId, req.params.code);

  res.send(device);
});

const authenticate = catchAsync(async (req, res) => {
  const device = await deviceService.getDeviceById(req.params.deviceId);
  const process = getProcess(device);
  console.log(process);

  if (!process.started) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Device "${device.name}"(${device.id}) service is dead.`);
  }

  if (!process.subscribers.has('secret')) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `Device "${device.name}"(${device.id}) has no subscriber "secret".`)
  }

  const { code } = req.body;
  const subscriber = process.subscribers.get('secret');
  subscriber(code);

  res.send(device);
});

module.exports = {
  getDevice,
  getLocalDevices,
  deleteDevice,
  getState,
  setState,
  authenticate,
};
