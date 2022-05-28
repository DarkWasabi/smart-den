const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const socialProviders = require('../config/socials');

const socialSchema = mongoose.Schema(
  {
    providerId: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: [socialProviders.AMAZON, socialProviders.GOOGLE],
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
socialSchema.index({ provider: 1, providerId: 1 }, { unique: true });

// add plugin that converts mongoose to json
socialSchema.plugin(toJSON);

/**
 * @typedef Social
 */
const Social = mongoose.model('Social', socialSchema);

module.exports = Social;
