const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeService } = require('../services');

const discovery = catchAsync(async (req, res) => {
  const result = await homeService.getHomesByUser(req.user);

  res.send(result);
});

module.exports = {
  discovery,
};
