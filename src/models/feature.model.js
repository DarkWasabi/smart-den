const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const features = Object.keys(require('../devices/features'));

const stateSchema = mongoose.Schema(
  {
    string: {
      type: String,
    },
    boolean: {
      type: Boolean,
    },
    number: {
      type: Number
    },
  },
  {
    timestamps: true,
  }
);
stateSchema.plugin(toJSON);

const featureSchema = mongoose.Schema(
  {
    code: {
      type: String,
      enum: features,
      required: true,
    },
    states: [stateSchema],
  },
  {
    timestamps: true,
  },
);
featureSchema.plugin(toJSON);

/**
 * @typedef Feature
 */
const Feature = mongoose.model('Feature', featureSchema);

module.exports = Feature;
