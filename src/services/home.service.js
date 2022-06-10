const httpStatus = require('http-status');
const { Home, Feature } = require('../models');
const { createDevice } = require('./device.service');
const adapters = require('../devices/adapters');
const ApiError = require('../utils/ApiError');

/**
 * Create a home
 * @param {Object} homeBody
 * @returns {Promise<Home>}
 */
const createHome = async (homeBody) => {
  return Home.create(homeBody);
};

/**
 * Query for homes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHomes = async (filter, options) => {
  const homes = await Home.paginate(filter, options);
  return homes;
};

/**
 * Get home by user
 * @param {User} user
 * @returns {Promise<Home[]>}
 */
const getHomesByUser = async (user) => {
  const homes = await Home.find({ user });
  return homes;
};

/**
 * Get home by id
 * @param {ObjectId} id
 * @returns {Promise<Home>}
 */
const getHomeById = async (id) => {
  return Home.findById(id);
};

/**
 * Update home by id
 * @param {ObjectId} homeId
 * @param {Object} updateBody
 * @returns {Promise<Home>}
 */
const updateHomeById = async (homeId, updateBody) => {
  const home = await getHomeById(homeId);
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home not found');
  }
  Object.assign(home, updateBody);
  await home.save();
  return home;
};

/**
 * Delete home by id
 * @param {ObjectId} homeId
 * @returns {Promise<Home>}
 */
const deleteHomeById = async (homeId) => {
  const home = await getHomeById(homeId);
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home not found');
  }
  await home.remove();
  return home;
};

/**
 * Delete home by id
 * @param {ObjectId} homeId
 * @param {Object} updateBody
 * @returns {Promise<Home>}
 */
const addHomeDeviceById = async (homeId, deviceBody) => {
  const home = await getHomeById(homeId);
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home not found');
  }
  const device = await createDevice({ ...deviceBody, home: homeId });

  // home.devices.push(device.id);
  // home.save();

  return device;
};

module.exports = {
  createHome,
  queryHomes,
  getHomesByUser,
  getHomeById,
  updateHomeById,
  deleteHomeById,
  addHomeDeviceById,
};
