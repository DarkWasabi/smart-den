const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const homeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      require: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
homeSchema.plugin(toJSON);
homeSchema.plugin(paginate);

/**
 * @typedef Home
 */
const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
