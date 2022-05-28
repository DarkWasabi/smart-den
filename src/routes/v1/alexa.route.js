const express = require('express');
const auth = require('../../middlewares/amazonAuth');

const router = express.Router();

router.route('/').get(auth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
