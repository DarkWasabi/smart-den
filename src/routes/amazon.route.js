const express = require('express');
const passport = require('passport');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth(), passport.authenticate('amazon', { scope: 'profile' }));

router.route('/callback').get(auth(), passport.authenticate('amazon', { failureRedirect: '/login' }), (req, res) => {
  console.log(req.user);
  // Successful authentication, redirect home.
  res.redirect('/');
});

module.exports = router;
