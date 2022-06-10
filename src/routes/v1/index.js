const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const homeRoute = require('./home.route');
const deviceRoute = require('./device.route');
const alexaRoute = require('./alexa.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/homes',
    route: homeRoute,
  },
  {
    path: '/alexa',
    route: alexaRoute,
  },
  {
    path: '/devices',
    route: deviceRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
