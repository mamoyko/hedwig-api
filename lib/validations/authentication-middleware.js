const auth = {};
const ERROR_CODES = require("../constants/error-codes");
const JWTHelper = require("../jwt/jwt-helper");

auth.isAuthenticated = async (req, res, next) => {
  const bearerToken = req.get("Authorization");
  const session_token = bearerToken.split(" ")[1];
  try {
    const session = await JWTHelper.verify(session_token);
    if (session.expired) {
      return res.status(401).send(ERROR_CODES.ERROR_EXPIRED_TOKEN);
    }
    if (!session) {
      return res.status(401).send(ERROR_CODES.ERROR_AUTHORIZATION_TOKEN);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

auth.isAdmin = async (req, res, next) => {
  const bearerToken = req.get("Authorization");
  const session_token = bearerToken.split(" ")[1];

  try {
    const session = await JWTHelper.decode(session_token);
    if (!session) {
      return res.status(401).send(ERROR_CODES.ERROR_AUTHORIZATION_TOKEN);
    } else {
      if (session.role <= 1) return next();
      return res.status(401).send(ERROR_CODES.ERROR_ROLE_NOT_AUTHORIZED);
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = auth;
