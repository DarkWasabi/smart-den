const deviceTypes = require('../../config/deviceTypes');
const tvDecorator = require('./tv.decorator');

module.exports = {
  [deviceTypes.TV]: tvDecorator,
};
