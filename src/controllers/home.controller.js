const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { homeService } = require('../services');

const createHome = catchAsync(async (req, res) => {
  const home = await homeService.createHome(req.body);
  res.status(httpStatus.CREATED).send(home);
});

const getHomes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await homeService.queryHomes(filter, options);
  res.send(result);
});

const getHome = catchAsync(async (req, res) => {
  const home = await homeService.getHomeById(req.params.homeId);
  if (!home) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Home not found');
  }
  res.send(home);
});

const updateHome = catchAsync(async (req, res) => {
  const home = await homeService.updateHomeById(req.params.homeId, req.body);
  res.send(home);
});

const deleteHome = catchAsync(async (req, res) => {
  await homeService.deleteHomeById(req.params.homeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createHome,
  getHomes,
  getHome,
  updateHome,
  deleteHome,
};
