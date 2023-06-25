const UserController = {};
const { User } = require("../models");
const { authenticate } = require("../lib/passport");
const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET;
const ERROR_CODES = require("../lib/constants/error-codes");
const SUCCESS_CODES = require("../lib/constants/success-codes");
const ROLE_CODES = require("../lib/constants/roles");
const JWTHelper = require("../lib/jwt/jwt-helper");
const { get } = require("lodash");
const to = require("await-to-js").default;
const {
  generateSession,
  redisGetAllKeys,
  redisSetKey,
  redisSetExpire,
  redisDeleteKey,
} = require("../utils");

const logger = require("../lib/loggers");

const logs = (level, message) => {
  logger.log(level, message);
};

UserController.getUserMe = async (req, res, next) => {
  try {
    const bearerToken = req.get("Authorization");
    const session_token = bearerToken.split(" ")[1];
    const { id } = await JWTHelper.decode(session_token);
    const [err, user] = await to(User.findOne({ where: { id: id } }));
    if (err) {
      logs("error", `Error on getting user me::${err}`);
      return next(err.message);
    }
    return res.status(200).json(user);
  } catch (error) {
    logs("error", `Error on getting user me::${error}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

UserController.login = async (req, res, next) => {
  const username = req.body.username;

  let user = null;
  let created = false;
  let query = { email: username };
  let ldapData;
  let err;

  try {
    // Process LDAP
    if (process.env.NODE_ENV !== "development") {
      [err, ldapData] = await to(authenticate(req, res));
      if (err) {
        logs("error", `Error on lpda connection::${err}`);
        return res.status(401).json({
          error: true,
          message: err.message,
        });
      }
      query = { email: ldapData.userPrincipalName };
    }
    /** CHECK REDIS IF SESSION EXIST */
    const session = await redisGetAllKeys(username);
    if (Object.keys(session).length === 0) {
      [user, created] = await User.findOrCreate({
        where: query,
        defaults: {
          role: ROLE_CODES.CONTRIBUTOR,
          firstname: get(ldapData, "givenName", ""),
          lastname: get(ldapData, "sn", ""),
        },
      });

      const token = await generateSession({
        id: user.id,
        email: user.email,
        role: user.role,
        firstname: get(user, "firstname", ""),
        lastname: get(user, "lastname", ""),
      });

      return res.status(200).json({ token, created });
    } else {
      res.status(200).json({ ...session, created });
    }
  } catch (error) {
    logs("error", `Error on login::${error}`);
    return res.status(409).send(ERROR_CODES.AD_ACCOUNT_INVALID);
  }
};

UserController.changeRole = async (req, res, next) => {
  const user_id = req.params.user_id;
  const new_role = req.body.role;
  try {
    const user = await User.update(
      { role: new_role },
      {
        where: { id: user_id },
      }
    );

    if (user[0]) {
      return res.send({ user_id: user_id, ...SUCCESS_CODES.ROLE_UPDATED });
    } else {
      return res.status(409).send(ERROR_CODES.INVALID_USER_ID_DB);
    }
  } catch (err) {
    next(err);
  }
};

UserController.superUserAuth = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (
    email != "hedwig.admin@maya.ph" ||
    password != process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).send(ERROR_CODES.UNAUTHORIZED_ACCESS);
  } else {
    const session = await redisGetAllKeys(email);
    if (Object.keys(session).length === 0) {
      const token = await jwt.sign({ email: email, role: 0 }, key, {
        expiresIn: 300,
      });

      await redisSetKey(email, { token: token });
      await redisSetExpire(email, 300);
      return res.send({ token, ...SUCCESS_CODES.ADMIN_LOGGEDIN });
    } else {
      return res.send({ token: session.token, fetched: true });
    }
  }
};

UserController.logout = async (req, res, next) => {
  try {
    const bearerToken = req.get("Authorization");
    const session_token = bearerToken.split(" ")[1];
    const { id } = await JWTHelper.decode(session_token);
    const [err, user] = await to(User.findOne({ where: { id: id } }));
    if (err) return next(err.message);
    await redisDeleteKey(user.email);
    return res.status(200).json({
      message: "Logout",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = UserController;
