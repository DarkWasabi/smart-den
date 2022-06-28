const httpStatus = require('http-status');
const { Home } = require('../models');
const { createDevice } = require('./device.service');
const ApiError = require('../utils/ApiError');

/**
 * Create a home
 * @param {Object} homeBody
 * @returns {Promise<Home>}
 */
const createHome = async (homeBody, user) => {
  if (await getUserHome(user)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is assigned to another home.')
  }
  return Home.create({ ...homeBody, users: [user] });
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
  return Home.paginate(filter, options);
};

/**
 * @param {User} user
 * @returns {Promise<Home>}
 */
const getUserHome = async (user) => {
  const homes = await getHomesByUserId(user.id);

  return homes.pop();
}

/**
 * Get homes by user ID
 * @param {string} userId
 * @returns {Promise<Home[]>}
 */
const getHomesByUserId = async (userId) => {
  return Home.find({ users: userId }).populate('users').populate('devices');
};

/**
 * Get home by id
 * @param {ObjectId} id
 * @returns {Promise<Home>}
 */
const getHomeById = async (id) => {
  return Home.findById(id).populate('users').populate('devices');
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
 * Adds device to home
 * @param {Home|ObjectId} homeOrId
 * @param {Object} updateBody
 * @returns {Promise<Home>}
 */
const addNewDeviceToHome = async (homeOrId, deviceBody) => {
  const home = homeOrId instanceof Home ? homeOrId : await getHomeById(homeOrId);
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home not found');
  }

  const device = await createDevice({ ...deviceBody, home: home.id });
  home.devices.push(device.id);
  home.save();

  return device;
};

module.exports = {
  createHome,
  queryHomes,
  getHomesByUserId,
  getHomeById,
  updateHomeById,
  deleteHomeById,
  addNewDeviceToHome,
  getUserHome,
};
