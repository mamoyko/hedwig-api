const auth = require("../../lib/validations/authentication-middleware");
const JWTHelper = require("../../lib/jwt/jwt-helper");
const ERROR_CODES = require("../../lib/constants/error-codes");

jest.mock("../../lib/jwt/jwt-helper");

describe("isAuthenticated", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { get: jest.fn() };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  test("calls next() if the session is valid", async () => {
    const session = { expired: false };
    JWTHelper.verify.mockResolvedValue(session);
    req.get.mockReturnValue("valid_token");

    await auth.isAuthenticated(req, res, next);
  });

  test("returns 401 and ERROR_EXPIRED_TOKEN if the session is expired", async () => {
    const session = { expired: true };
    JWTHelper.verify.mockResolvedValue(session);
    req.get.mockReturnValue("expired_token");

    await auth.isAuthenticated(req, res, next);
  });

  test("returns 401 and ERROR_AUTHORIZATION_TOKEN if the session is invalid", async () => {
    JWTHelper.verify.mockResolvedValue(null);
    req.get.mockReturnValue("invalid_token");

    await auth.isAuthenticated(req, res, next);
  });

  test("calls next() with an error if an error occurs during verification", async () => {
    const err = new Error("verification error");
    JWTHelper.verify.mockRejectedValue(err);
    req.get.mockReturnValue("valid_token");

    await auth.isAuthenticated(req, res, next);
  });
});

describe("isAdmin", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { get: jest.fn() };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  test("calls next() if the session is valid and the user is an admin", async () => {
    const session = { role: 1 };
    JWTHelper.decode.mockReturnValue(session);
    req.get.mockReturnValue("valid_token");

    await auth.isAdmin(req, res, next);
  });

  test("returns 401 and ERROR_AUTHORIZATION_TOKEN if the session is invalid", async () => {
    JWTHelper.decode.mockReturnValue(null);
    req.get.mockReturnValue("invalid_token");

    await auth.isAdmin(req, res, next);
  });
});
