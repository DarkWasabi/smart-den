const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const deviceTypes = require('../config/deviceTypes');
const Feature = require('./feature.model');

const adapterSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    config: {
      type: Map,
      of: String,
    },
  }
)
adapterSchema.plugin(toJSON);

const deviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: deviceTypes,
      default: deviceTypes.OTHER,
    },
    adapter: adapterSchema,
    home: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Home',
      required: true,
    },
    config: {
      type: Map,
      of: String,
    },
    features: [Feature.schema],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
deviceSchema.plugin(toJSON);

/**
 * @typedef Device
 */
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
