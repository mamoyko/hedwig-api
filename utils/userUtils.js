const JWTHelper = require("../lib/jwt/jwt-helper");
const { redisSetKey, redisSetExpire } = require("./redisUtils");
const { User } = require("../models");

const generateSession = async (payload) => {
  const token = await JWTHelper.sign(payload);
  await redisSetKey(payload.email, { token });
  await redisSetExpire(payload.email, 1800);
  return token;
};

const getUserByToken = async (token) => {
  const { id } = await JWTHelper.decode(token);
  return await User.findOne({ where: { id: id } });
};

module.exports = {
  generateSession,
  getUserByToken,
};
