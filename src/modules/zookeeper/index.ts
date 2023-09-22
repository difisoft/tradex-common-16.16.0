import { createClient } from 'node-zookeeper-client';
import { logger } from "../log";

let zkClient = null;
let connected = false;
let cachedFunctions = [];

/**
 * @param func {Function}
 */
function zk(func: any) {
  if (connected) {
    func(zkClient);
  } else {
    cachedFunctions.push(func);
  }
}

function init(conf: any) {
  if (zkClient) {
    try {
      zkClient.close();
    } catch (e) {
      // do nothing
    }
  }
  logger.info(conf.zkUrls[0]);
  zkClient = createClient(conf.zkUrls[0]);
  connected = false;
  cachedFunctions = [];
  zkClient.once('connected', () => {
    logger.info('connected to zk server');
    connected = true;
    cachedFunctions.forEach((func: any) => func(zkClient));
    cachedFunctions = [];
  });
  zkClient.on('disconnected', (e: any) => logger.logError('disconnect', e));
  logger.info('connecting...');
  zkClient.connect();
}

export default {
  zk,
  init,
}
