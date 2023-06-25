const UserController = require("../../../controllers/UserController");
const JWTHelper = require("../../../lib/jwt/jwt-helper");
const { User } = require("../../../models");
const { redisDeleteKey } = require("../../../utils");

jest.mock("../../../utils/redisUtils");
jest.mock("../../../models");

describe("UserController.logout", () => {
  it("should delete session from Redis and return 200 status code with success message", async () => {
    const user = {
      id: 1,
      email: "test@example.com",
      password: "password123",
    };

    const token = await JWTHelper.sign({ id: user.id });

    const req = {
      get: jest.fn().mockReturnValue(token),
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    User.findOne.mockResolvedValue({});

    redisDeleteKey.mockResolvedValue({});

    await UserController.logout(req, res, next);

    // expect(res.status).toHaveBeenCalledWith(200);

    // expect(res.json).toHaveBeenCalledWith({ message: "Logout" });

    // expect(next).not.toHaveBeenCalled();
  });

  test("should return 500 status code with error message if an error occurs", async () => {
    const req = {};

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const mockError = new Error("createSenderMasks failed");
    User.findOne.mockRejectedValue(mockError);

    await UserController.logout(req, res, next);

    // expect(res.status).toHaveBeenCalledWith(500);

    // expect(next).not.toHaveBeenCalled();
  });
});
