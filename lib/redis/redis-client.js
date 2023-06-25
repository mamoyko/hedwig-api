const {createClient} = require('redis');
const logger = require("../../lib/loggers");
const redisClient = createClient({url: process.env.REDIS_CREDENTIALS});

const logs = (level, message) => {
  logger.log(level, message);
};

const connect = async () => {
  try {
    await redisClient.connect();
    logs("info", "Redis Connection Success!");
  } catch (err) {
    logs("error", `Redis error: ${err}`);
  }
};

redisClient.on('error', (err) => logs("error", `client error: ${err}`));
redisClient.on('reconnecting', () => logs("info", "client is reconnecting!"));
redisClient.on('ready', () => logs("info", "client is ready!"));

connect();

module.exports = redisClient;
