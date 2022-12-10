const { AndroidRemote } = require('androidtv-remote');
const Device = require('../../../models/device.model');

const EVENT_SECRET = 'secret';
const EVENT_POWERED = 'powered';
const EVENT_CURRENT_APP = 'current_app';
const EVENT_READY = 'ready';

const processes = new Map();
/**
 * @param {Device} device
 */
const makeProcess = (device) => {
  if (!processes.has(device.id)) {
    /** @typedef AndroidRemoteProcess */
    const process = {
      device,
      remote: null,
      started: false,
      subscribers: new Map(), // TODO: move to MQTT or so
      async start () {
        const host = this.device.getConfig('host');

        const options = {
          pairing_port: this.device.getConfig('pairingPort'),
          remote_port: this.device.getConfig('remotePort'),
          cert: JSON.parse(this.device.getConfig('cert')) || {},
          name: `[${this.device.name || '?'}] TV remote`,
        }
        const androidRemote = this.remote = new AndroidRemote(host, options);

        androidRemote.on(EVENT_SECRET, () => {
          if (this.subscribers.has(EVENT_SECRET)) {
            return;
          }
          this.subscribers.set(EVENT_SECRET, (secret) => this.remote.sendCode(secret));
        });

        androidRemote.on(EVENT_CURRENT_APP, (currentApp) => {
          console.log('CURRENT APP EVENT EMITTED ' + currentApp);
        });

        androidRemote.on(EVENT_POWERED, (powered) => {
          console.log('POWERED EVENT EMITTED ' + powered);
        });

        androidRemote.on(EVENT_READY, async () => {
          if (!this.device.getConfig('cert')) {
            const cert = await androidRemote.getCertificate();
            this.device.setConfig('cert', JSON.stringify(cert));
            this.device.save();
          }
        });

        this.started = true;
        androidRemote.start();
      },
      stop () {
        if (!this.remote) {
          throw new Error('Can\'t stop dead process.');
        }
        this.started = false;

        this.remote.stop();
      }
    };

    processes.set(device.id, process);
  }

  return processes.get(device.id);
};

module.exports = makeProcess;