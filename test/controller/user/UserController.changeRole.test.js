const UserController = require("../../../controllers/UserController");
const { User } = require("../../../models");
// const { SUCCESS_CODES, ERROR_CODES } = require("../../../constants");

describe("UserController.changeRole", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: { user_id: 1 },
      body: { role: "admin" },
    };
    res = {
      send: jest.fn(),
      status: jest.fn(() => res),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should update user role and send success response", async () => {
    User.update = jest.fn(() => [1]);

    await UserController.changeRole(req, res);

    expect(User.update).toHaveBeenCalledWith(
      { role: "admin" },
      { where: { id: 1 } }
    );
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should send error response for invalid user id", async () => {
    User.update = jest.fn(() => [0]);

    await UserController.changeRole(req, res, next);

    expect(User.update).toHaveBeenCalledWith(
      { role: "admin" },
      { where: { id: 1 } }
    );
    expect(res.status).toHaveBeenCalledWith(409);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next function for database error", async () => {
    const error = new Error("database error");
    User.update = jest.fn(() => {
      throw error;
    });

    await UserController.changeRole(req, res, next);

    expect(User.update).toHaveBeenCalledWith(
      { role: "admin" },
      { where: { id: 1 } }
    );
    expect(next).toHaveBeenCalledWith(error);
    expect(res.send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
