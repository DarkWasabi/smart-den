const { Social } = require('../models');

/**
 * Get user by id
 * @param {String} providerId
 * @param {String} provider
 * @returns {Promise<User>}
 */
const getUserByProviderAndProviderId = async (provider, providerId) => {
  const social = await Social.findOne({ provider, providerId }).populate('user');

  return (social || {}).user || null;
};

/**
 * Get user by id
 * @param {String} token
 * @returns {Promise<User>}
 */
const getUserByToken = async (token) => {
  const social = await Social.findOne({ token }).populate('user');

  return (social || {}).user || null;
};

module.exports = {
  getUserByProviderAndProviderId,
  getUserByToken,
};
