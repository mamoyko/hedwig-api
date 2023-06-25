const { SenderMasks } = require("../../models");

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

jest.mock("../../models");

describe("Sender masks services", () => {
  test("should create a new sender masks", (done) => {
    SenderMasks.create.mockResolvedValueOnce(senderMask[0]);
    createSenderMasks(senderMask[0]).then((results) => {
      expect(results).toEqual(senderMask[0]);
      done();
    });
  });

  test("should return the sendermask data by id", (done) => {
    SenderMasks.findOne.mockResolvedValueOnce(senderMask[0]);
    getSenderMasks(senderMask[0].id).then((results) => {
      expect(results).toEqual(senderMask[0]);
      done();
    });
  });

  test("should return the all the sendermask data", (done) => {
    SenderMasks.findAll.mockResolvedValueOnce(senderMask);
    getSenderMasks().then((results) => {
      expect(results).toEqual(senderMask);
      done();
    });
  });

  test("should update the sendermasks", (done) => {
    SenderMasks.update.mockResolvedValueOnce([1]);
    updateSenderMasks(senderMask[0].id, { name: "maya updated" }).then(
      (results) => {
        expect(results).toEqual([1]);
        done();
      }
    );
  });

  test("should delete the sendermasks", (done) => {
    SenderMasks.destroy.mockResolvedValueOnce([1]);
    deleteSenderMasks(senderMask[0].id).then((results) => {
      expect(results).toEqual([1]);
      done();
    });
  });
});
