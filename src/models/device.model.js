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

deviceSchema.methods.getConfig = function(key) {
  return this.adapter.config.get(key);
}
deviceSchema.methods.setConfig = function(key, value) {
  this.adapter.config.set(key, value);
  this.save();
}
deviceSchema.methods.getState = function(state) {
  return this.features.findOne({ code: state }).states[0];
}
deviceSchema.methods.setState = function(state, newValue) {
  this.features.find({ code: state }).states.push({
    string: newValue, // TODO: make different state types
  });
  this.save();
}


/**
 * @typedef Device
 */
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
