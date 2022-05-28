const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: AmazonStrategy } = require('passport-amazon');
const generator = require('generate-password');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const { Social } = require('../models');
const { userService } = require('../services');

const jwtFromRequest = (req) => {
  let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (!token && ((req || {}).cookies || {}).access_token) {
    token = req.cookies.access_token;
  }

  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest,
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

const amazonOptions = {
  clientID: config.amazon.clientID,
  clientSecret: config.amazon.clientSecret,
  callbackURL: config.amazon.callbackURL,
  passReqToCallback: true,
};

const amazonVerify = async (req, accessToken, refreshToken, profile, done) => {
  const { provider, id: providerId } = profile;
  const social = Social.findOne({ provider, providerId });
  let { user } = req;

  try {
    if (social) {
      user = social.user;
    } else if (user) {
      Social.create({ provider, providerId, user, token: accessToken });
    } else {
      const password = generator.generate({ length: 12, numbers: true });
      user = userService.createUser({
        name: profile.displayName,
        email: profile.emails[0].value,
        isEmailVerified: true,
        password,
      });
      Social.create({ provider, providerId, user, token: accessToken });
    }
  } catch (error) {
    done(error, false);
  }

  done(null, user);
};

const amazonStrategy = new AmazonStrategy(amazonOptions, amazonVerify);

module.exports = {
  jwtStrategy,
  amazonStrategy,
};
