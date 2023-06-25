const JWTHelper = {};
const jwt = require("jsonwebtoken");
const secret_key = process.env.JWT_SECRET;

JWTHelper.sign = async (payload, expiry = 1800) => {
  try {
    const token = await jwt.sign(payload, secret_key, { expiresIn: expiry });
    return token;
  } catch (err) {
    return false;
  }
};

JWTHelper.verify = async (token) => {
  if (token === "undefined") return false;

  try {
    const { exp } = jwt.decode(token);
    if (Date.now() >= exp * 1800) {
      return { expired: true };
    }
    await jwt.verify(token, secret_key);
    return true;
  } catch (err) {
    return false;
  }
};

JWTHelper.decode = async (token) => {
  if (token === "undefined") return false;

  try {
    const data = await jwt.verify(token, secret_key);
    return data;
  } catch (err) {
    return false;
  }
};

module.exports = JWTHelper;
