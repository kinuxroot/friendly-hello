'use strict';

const os = require('os');
const process = require('process');
const express = require('express');

const util = require('util');
const redis = require('redis');
redis.RedisClient.prototype.incrAsync = util.promisify(redis.RedisClient.prototype.incr);

const client = redis.createClient();
client.on('error', err => {
  console.error('Error: ' + err);
});

const app = express();

app.get('/', async (req, res) => {
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
    console.error(e);

    res.json({
      error: 1,
      message: 'Cannot connect to Redis, counter disabled'
    });
  }
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Listened on 0.0.0.0:5000');
});
