const httpStatus = require('http-status');
const { amazonStrategy } = require('../config/passport');
const ApiError = require('../utils/ApiError');
const { socialService } = require('../services');

const auth = async (req, res, next) => {
  const bearer = req.headers.authorization;
  const token = bearer.replace('Bearer ', '');

  amazonStrategy.userProfile(token, async (err, profile) => {
    if (err || !profile) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    const { provider, id: providerId } = profile;
    const user = await socialService.getUserByProviderAndProviderId(provider, providerId);

    if (!user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }

    req.user = user;

    next();
  });
};

module.exports = auth;
