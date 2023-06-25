const SenderMasksController = require("../../controllers/SenderMasksController");
const {
  getSenderMasks,
  createSenderMasks,
  updateSenderMasks,
  deleteSenderMasks,
} = require("../../utils");

const senderMask = [
  {
    id: 1,
    name: "Maya",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 2,
    name: "MayaRewards",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 3,
    name: "MayaAgent",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 4,
    name: "MayaCenter",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 5,
    name: "MayaSavings",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 6,
    name: "MayaCredit",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 7,
    name: "MayaPayLatr",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 8,
    name: "MayaHoliday",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
  {
    id: 9,
    name: "MayaTest",
    createdAt: "2023-03-29T07:44:54.000Z",
    updatedAt: "2023-03-29T07:44:54.000Z",
  },
];

jest.mock("../../utils/senderMasksUtils");

describe("SenderMasksController", () => {
  test("should create a new sender masks", async () => {
    let req = {
      body: senderMask[0],
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockSenderMasks = senderMask[0];
    createSenderMasks.mockResolvedValueOnce(senderMask[0]);
    await SenderMasksController.createSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSenderMasks);
  });

  test("should return a 401 error response if createSenderMasks fails", async () => {
    let req = {
      body: senderMask[0],
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockError = new Error("createSenderMasks failed");
    createSenderMasks.mockRejectedValue(mockError);
    await SenderMasksController.createSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should return the sendermask data by id", async () => {
    getSenderMasks.mockResolvedValueOnce(senderMask[0]);
    let req = {
      query: {
        id: senderMask[0].id,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    await SenderMasksController.getAllSenderMasks(req, res);
    expect(res.json).toHaveBeenCalledWith(senderMask[0]);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return a 401 error response if getAllSenderMasks fails", async () => {
    let req = {
      query: {
        id: senderMask[0].id,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    const mockError = new Error("createSenderMasks failed");
    getSenderMasks.mockRejectedValue(mockError);
    await SenderMasksController.getAllSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should update the sendermasks", async () => {
    let req = {
      params: {
        id: senderMask[0].id,
      },
      body: {
        name: "update sender masks",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    updateSenderMasks.mockResolvedValueOnce([1]);
    getSenderMasks.mockResolvedValueOnce(senderMask);
    await SenderMasksController.updateSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return a 401 on updating the sendermasks", async () => {
    let req = {
      params: {
        id: senderMask[0].id,
      },
      body: {
        name: "update sender masks",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    updateSenderMasks.mockResolvedValueOnce([0]);
    const mockError = new Error("createSenderMasks failed");
    getSenderMasks.mockRejectedValue(mockError);
    await SenderMasksController.updateSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should delete the sendermasks by id", async () => {
    let req = {
      params: {
        id: senderMask[0].id,
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    deleteSenderMasks.mockResolvedValueOnce([1]);
    getSenderMasks.mockResolvedValueOnce(senderMask);
    await SenderMasksController.deleteSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return a 401 on deleting the sendermasks", async () => {
    let req = {
      params: {
        id: senderMask[0].id,
      },
      body: {
        name: "update sender masks",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    deleteSenderMasks.mockResolvedValueOnce([0]);
    const mockError = new Error("createSenderMasks failed");
    getSenderMasks.mockRejectedValue(mockError);
    await SenderMasksController.deleteSenderMasks(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
