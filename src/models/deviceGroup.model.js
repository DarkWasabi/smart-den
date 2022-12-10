const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    devices: [{
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Device',
    }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
schema.plugin(toJSON);

/**
 * @typedef DeviceGroup
 */
const DeviceGroup = mongoose.model('DeviceGroup', schema);

module.exports = DeviceGroup;
