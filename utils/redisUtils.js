const redisClient = require("../lib/redis/redis-client");

const redisSetKey = async (email, token) => {
  await redisClient.hSet(email, token);
};

const redisSetExpire = async (email, duration) => {
  await redisClient.expire(email, duration);
};

const redisGetAllKeys = async (username) => {
  return await redisClient.hGetAll(username);
};

const redisDeleteKey = async (key) => {
  return await redisClient.del(key);
};

module.exports = {
  redisSetKey,
  redisSetExpire,
  redisGetAllKeys,
  redisDeleteKey,
};
