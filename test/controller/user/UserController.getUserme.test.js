const JWTHelper = require("../../../lib/jwt/jwt-helper");
const { User } = require("../../../models");
const UserController = require("../../../controllers/UserController");

jest.mock("../../../lib/jwt/jwt-helper");
jest.mock("../../../models");

describe("UserController", () => {
  describe("getUserMe", () => {
    it("returns the user when a valid session token is provided", async () => {
      // Arrange
      const bearerToken = `Bearer valid_session_token`;
      const session_token = bearerToken.split(" ")[1];

      const user = { id: 1, name: "John Doe" };
      const req = { get: jest.fn().mockReturnValue(bearerToken) };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Mock the decode function of JWTHelper to return the user ID
      JWTHelper.decode.mockResolvedValue({ id: user.id });

      // Mock the findOne method of User model to return the user
      User.findOne.mockResolvedValue(user);

      // Act
      await UserController.getUserMe(req, res, next);

      // Assert
      expect(JWTHelper.decode).toHaveBeenCalledWith(session_token);
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: user.id } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
      expect(next).not.toHaveBeenCalled();
    });

    it("calls the next middleware function with the error message when an error occurs while retrieving the user", async () => {
      // Arrange
      const bearerToken = `Bearer valid_session_token`;
      const session_token = bearerToken.split(" ")[1];
      const error = new Error("Something went wrong");
      const req = { get: jest.fn().mockReturnValue(bearerToken) };
      const res = {};
      const next = jest.fn();

      // Mock the decode function of JWTHelper to return the user ID
      JWTHelper.decode.mockResolvedValue({ id: 1 });

      // Mock the findOne method of User model to throw an error
      User.findOne.mockRejectedValue(error);

      // Act
      await UserController.getUserMe(req, res, next);

      // Assert
      expect(JWTHelper.decode).toHaveBeenCalledWith(session_token);
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(next).toHaveBeenCalledWith(error.message);
    });

    it("returns a server error response when an error occurs while decoding the session token", async () => {
      // Arrange
      const bearerToken = `Bearer valid_session_token`;
      const session_token = bearerToken.split(" ")[1];
      const error = new Error("Invalid token");
      const req = { get: jest.fn().mockReturnValue(bearerToken) };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      // Mock the decode function of JWTHelper to throw an error
      JWTHelper.decode.mockRejectedValue(error);

      // Act
      await UserController.getUserMe(req, res, next);

      // Assert
      expect(JWTHelper.decode).toHaveBeenCalledWith("valid_session_token");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: error.message,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
