const androidRemote = require('./androidRemote.adapter');

const adapters = new Map([
  [androidRemote.code, androidRemote],
]);

const processes = new Map();

/**
 * @param {Device} device
 * @returns
 */
const getProcess = (device) => {
  if (!processes.has(device.id)) {
    if (!adapters.has(device.adapter.code)) {
      throw new Error(`No adapter available for ${device.adapter.code}`);
    }
    processes.set(device.id, adapters.get(device.adapter.code).makeProcess(device));
  }

  return processes.get(device.id);
}

/**
 * @param {String} code
 */
const getAdapterByCode = (code) => adapters[code] || null;
/**
 * @param {Device} device
 */
const getAdapterByDevice = (device) => getAdapterByCode(device.adapter.code);

module.exports = {
  getAdapterByCode,
  getAdapterByDevice,
  getProcess,
}
