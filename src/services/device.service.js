const httpStatus = require('http-status');
const findLocalDevices = require('local-devices');
const oui = require('oui');
const { Device } = require('../models');
const { localDevices } = require('../config/localDevices');
const adapters = require('../devices/adapters');
const ApiError = require('../utils/ApiError');
const homeService = require('./home.service');

/**
 * Get devices from local network. // TODO: NOT WORKING properly on Mac OS Docker
 * @returns {Promise<Device[]>}
 */
const getLocalDevices = async (address) => {
  const discovered = (await findLocalDevices(address))
    .filter((device) => !!device.mac && !!device.ip)
    .map((device) => {
      const vendor = oui(device.mac).split('\n')[0];
      return { ...device, name: vendor };
    });

  // TODO: remove config devices
  if (!discovered.length) {
    console.warn('returning local devices from config file');
    return localDevices;
  }

  return discovered;
}

/**
 * Get device by id
 * @param {ObjectId} id
 * @returns {Promise<Device>}
 */
const getDeviceById = async (deviceId) => {
  return await Device.findById(deviceId);
}

/**
 * Get devices by home ID
 * @param {ObjectId} homeId
 * @returns {Promise<Device[]>}
 */
const getDevicesByHomeId = async (homeId) => {
  return await Device.find({ home: homeId }).populate('home').populate('features');
}

/**
 * Create new device
 * @param {Object} deviceBody
 * @param {string} [deviceBody.name] - Device name, required
 * @param {string} [deviceBody.home] - Home ID, required
 * @param {string} [deviceBody.type] - Device type ("Tv", "Other"), required
 * @param {Object} [deviceBody.adapter] - Device adapter
 * @param {string} [deviceBody.adapter.code] - Device adapter code
 * @param {Object} [deviceBody.adapter.config] - Device adapter config
 * @returns {Promise<Device>}
 */
const createDevice = async (deviceBody) => {
  const { adapter } = deviceBody;
  const internalAdapter = adapters(adapter.code);
  if (!internalAdapter) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid adapter code'); // TODO: move to validation
  }
  const features = internalAdapter.features.map((code) => ({
    code,
    states: [],
  }));

  return await Device.create({ ...deviceBody, features });
}

/**
 * Delete device by ID
 * @param {ObjectId} deviceId
 * @returns {Promise<Device>}
 */
const deleteDeviceById = async (deviceId) => {
  const device = await getDeviceById(deviceId);
  if (!device) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Device not found');
  }
  await device.remove();
  return device;
}

/**
 * //TODO: add multiple homes support
 * @param {User} user
 * @returns {Device[]}
 */
const getDevicesByUserId = async (userId) => {
  const home = (await homeService.getHomesByUserId(userId)).populate('devices').pop();

  return home.devices;
}

const getDeviceStateByCode = async (deviceId, stateCode) => {
  // const devices = await Device.find({ _id: deviceId, 'features.code': stateCode });
  console.log(devices);
  const devices = await Device.aggregate([{
    '$match': {
      '_id': deviceId,
      'features.code': stateCode,
    }
  }]).exec();
}

module.exports = {
  getLocalDevices,
  getDeviceById,
  getDevicesByHomeId,
  createDevice,
  deleteDeviceById,
  getDevicesByUserId,
  getDeviceStateByCode,
};
