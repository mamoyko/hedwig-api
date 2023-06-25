const { getActivityList } = require("../../../utils");
const BlastController = require("../../../controllers/BlastController");
const db = require("../../../models");

jest.mock("../../../utils/activityListUtils");
jest.mock("../../../models");

describe("BlastController.auditTrail", () => {
  test("should return audit trail", async () => {
    const req = {
      get: jest.fn(() => "valid_session_token"),
      query: { limit: 10, page: 1 },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const data = { activities: [], count: 0 };
    getActivityList.mockResolvedValue(data);

    await BlastController.auditTrail(req, res);
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

    const next = jest.fn();

    const error = new Error("Database error");

    await BlastController.auditTrail(req, res, next);
  });
});
