'use strict';

const serverConfig = require('./config/server');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const os = require('os');
const process = require('process');
const express = require('express');

const util = require('util');
const redis = require('redis');
redis.RedisClient.prototype.incrAsync = util.promisify(redis.RedisClient.prototype.incr);

const client = redis.createClient();
client.on('error', err => {
  logger.error(err);
});

const app = express();

app.get('/', async(req, res) => {
  try {
    const visits = await client.incrAsync('counter');

    const hostname = os.hostname();
    const name = 'NAME' in process.env ? process.env['NAME'] : 'world';

    res.json({
      error: 0,
      message: 'successful',
      data: {
        hostname,
        name,
        visits
      }
    })
  }
  catch (e) {
    logger.error(e);

    res.json({
      error: 1,
      message: 'Cannot connect to Redis, counter disabled'
    });
  }
});

app.listen(serverConfig.port, serverConfig.host, () => {
  logger.info(`Listened on ${serverConfig.host}:${serverConfig.port}`);
});
