const UserController = require("../../../controllers/UserController");
const { authenticate } = require("../../../lib/passport");
const { User } = require("../../../models");
const { generateSession, redisGetAllKeys } = require("../../../utils");

jest.mock("../../../lib/passport");
jest.mock("../../../models");
jest.mock("../../../utils/userUtils");
jest.mock("../../../utils/redisUtils");

describe("UserController", () => {
  describe("login", () => {
    let req, res, next;
    beforeEach(() => {
      req = {
        body: {
          username: "test@example.com",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      next = jest.fn();
    });

    test("should return a token and created flag when session does not exist", async () => {
      const mockLDAPData = {
        userPrincipalName: "test@example.com",
        givenName: "John",
        sn: "Doe",
      };
      authenticate.mockResolvedValue(mockLDAPData);
      redisGetAllKeys.mockResolvedValue({});

      const mockUser = {
        id: 1,
        email: "test@example.com",
        role: "contributor",
        firstname: "John",
        lastname: "Doe",
      };
      User.findOrCreate.mockResolvedValue([mockUser, true]);

      const mockToken = "mock_token";
      generateSession.mockResolvedValue(mockToken);

      await UserController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: mockToken,
        created: true,
      });
    });

    test("should return existing session and created flag when session exists", async () => {
      const mockSession = {
        id: 1,
        email: "test@example.com",
        role: "contributor",
        firstname: "John",
        lastname: "Doe",
      };
      redisGetAllKeys.mockResolvedValue(mockSession);

      await UserController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ...mockSession, created: false });
    });

    test("should return an error if LDAP authentication fails", async () => {
      const mockError = new Error("LDAP authentication failed");
      authenticate.mockRejectedValue(mockError);

      await UserController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: mockError.message,
      });
    });
  });
});
