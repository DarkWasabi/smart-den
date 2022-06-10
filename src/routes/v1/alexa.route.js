const express = require('express');
const auth = require('../../middlewares/amazonAuth');
const { alexaController } = require('../../controllers');

const router = express.Router();

router.route('/discovery').get(auth, alexaController.discovery);

module.exports = router;
