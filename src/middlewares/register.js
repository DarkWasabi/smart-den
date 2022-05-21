const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');

const register = async (req, res, next) => {
  if (await User.isFirstUser()) {
    next();
  } else {
    next(new ApiError(httpStatus.FORBIDDEN, 'Admin user is already registered'));
  }
};

module.exports = register;
