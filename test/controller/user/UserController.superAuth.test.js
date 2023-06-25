const UserController = require("../../../controllers/UserController");
// const { SUCCESS_CODES, ERROR_CODES } = require("./constants");
const {
  redisGetAllKeys,
  redisSetKey,
  redisSetExpire,
} = require("../../../utils");
const jwt = require("jsonwebtoken");

jest.mock("../../../utils/redisUtils");

describe("UserController.superUserAuth", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: { email: "hedwig.admin@maya.ph", password: "admin123" },
    };
    res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    };
    next = jest.fn();
    process.env.ADMIN_PASSWORD = "admin123";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should login admin and set token in Redis", async () => {
    redisGetAllKeys.mockResolvedValue({});
    jwt.sign = jest.fn(() => "jwt_token");
    redisSetKey.mockResolvedValue({});
    redisSetExpire.mockResolvedValue({});

    await UserController.superUserAuth(req, res, next);

    expect(redisGetAllKeys).toHaveBeenCalledWith("hedwig.admin@maya.ph");
    expect(redisSetKey).toHaveBeenCalledWith("hedwig.admin@maya.ph", {
      token: "jwt_token",
    });
    expect(redisSetExpire).toHaveBeenCalledWith("hedwig.admin@maya.ph", 300);
    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should return existing token from Redis", async () => {
    redisGetAllKeys.mockResolvedValue({ token: "jwt_token" });

    await UserController.superUserAuth(req, res, next);

    expect(redisGetAllKeys).toHaveBeenCalledWith("hedwig.admin@maya.ph");
    expect(res.send).toHaveBeenCalledWith({
      token: "jwt_token",
      fetched: true,
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should return unauthorized access for invalid credentials", async () => {
    req.body = { email: "test@test.com", password: "invalid" };

    await UserController.superUserAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(redisGetAllKeys).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(redisSetKey).not.toHaveBeenCalled();
    expect(redisSetExpire).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should return unauthorized access for missing credentials", async () => {
    req.body = {};

    await UserController.superUserAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(redisGetAllKeys).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(redisSetKey).not.toHaveBeenCalled();
    expect(redisSetExpire).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
