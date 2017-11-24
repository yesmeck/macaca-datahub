'use strict';

const path = require('path');
const eggServer = require('egg');

const defaultOptions = {
  port: 9200,
  mode: 'production',
};

class DataHub {
  constructor(options = {}) {
    this.options = Object.assign(defaultOptions, options);
  }

  startServer() {
    const args = Array.prototype.slice.call(arguments);
    const options = args[0] || {};

    if (options.store) {
      process.env.DATAHUB_STORE_PATH = path.resolve(options.store);
    }

    process.env.EGG_SERVER_ENV = this.options.mode;

    const promise = new Promise(resolve => {
      eggServer.startCluster({
        workers: 1,
        port: this.options.port,
        baseDir: __dirname,
      }, () => {
        resolve();
      });
    });

    if (args.length > 1) {
      const cb = args[1];

      return promise.then(data => {
        cb.call(this, null, data);
      }).catch(err => {
        cb.call(this, `Error occurred: ${err}`);
      });
    }
    return promise;

  }
}

module.exports = DataHub;