const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeService } = require('../services');
const { discovery : alexaDiscovery } = require('../alexa/decorator');

const discovery = catchAsync(async (req, res) => {
  // TODO: make home management, now user can have only one home
  const home = (await homeService.getHomesByUser(req.user))[0];

  if (!home || !home.devices.length) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No devices');
  }
  const result = alexaDiscovery(home.devices);

  res.send(result);
});

module.exports = {
  discovery,
};
