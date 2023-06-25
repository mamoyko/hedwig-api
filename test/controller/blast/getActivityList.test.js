const { getUserByToken, getActivityList } = require("../../../utils");
const BlastController = require("../../../controllers/BlastController");

jest.mock("../../../utils/userUtils");
jest.mock("../../../utils/activityListUtils");

describe("BlastController.getActivityList", () => {
  test("should return activity list", async () => {
    const req = {
      get: jest.fn(() => "Bearer valid_session_token"),
      query: { limit: 10, page: 1 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const user = { id: 123 };
    const data = { activities: [], count: 0 };
    getUserByToken.mockResolvedValue(user);
    getActivityList.mockResolvedValue(data);

    await BlastController.getActivityList(req, res);

    expect(getUserByToken).toHaveBeenCalledWith("valid_session_token");
    expect(getActivityList).toHaveBeenCalledWith({
      limit: 10,
      page: 1,
      user_id: 123,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(data);
  });

  test("should handle error", async () => {
    const req = {
      get: jest.fn(() => "valid_session_token"),
      query: { limit: 10, page: 1 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const error = new Error("Internal server error");
    getUserByToken.mockRejectedValue(error);

    await BlastController.getActivityList(req, res);

    expect(getUserByToken).toHaveBeenCalledWith("valid_session_token");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: true,
      message: error.message,
    });
  });
});
