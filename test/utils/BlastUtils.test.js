const { SmsBlasts } = require("../../models");

const {
  getBlastById,
  createBlast,
  updateBlast,
  parseFormData,
  parseBlastData,
} = require("../../utils");

const blastData = {
  id: "2942e2dd-af60-4f60-b8e8-51ca7c603ee6",
  name: "sender bkast v2",
  recipient_type: "multiple",
  status: "completed",
  message: "message from maya",
  sender_masks_id: "1",
  user_id: "ae3f099a-1d47-407b-8774-644d5d79cfee",
  phone_number: null,
  vcm_transaction_id: "",
  createdAt: "2023-03-30 01:39:05",
  updatedAt: "2023-03-30 01:39:08",
};

jest.mock("../../models");

describe("SMS Blast services", () => {
  test("should create a new blast", (done) => {
    SmsBlasts.create.mockResolvedValueOnce(blastData);
    createBlast(blastData).then((results) => {
      expect(results).toEqual(blastData);
      done();
    });
  });

  test("should return the blast data by id", (done) => {
    SmsBlasts.findOne.mockResolvedValueOnce(blastData);
    getBlastById(blastData.id).then((results) => {
      expect(results).toEqual(blastData);
      done();
    });
  });

  test("should update the blast", (done) => {
    SmsBlasts.update.mockResolvedValueOnce([1]);
    updateBlast(blastData.id, { status: "completed" }).then((results) => {
      expect(results).toEqual([1]);
      done();
    });
  });

  test("should returm formData", (done) => {
    parseFormData({
      appname: "appname",
      sender: "sender masks",
      mask: "sender masks",
      mode: "sdp",
      priority: 1,
      tariff: 0.0,
      message: "message",
    });
    done();
  });

  test("should parse blast data correctly", () => {
    const payload = {
      blast: {
        id: 1,
        name: "Test Blast",
        recipient_type: "group",
        status: "completed",
        message: "Hello World",
        phone_number: "1234567890",
        user_id: 1,
        vcm_transaction_id: "abc123",
        createdAt: "2022-01-01",
        updatedAt: "2022-01-02",
      },
      senderMask: {
        name: "Test Mask",
      },
    };

    const result = parseBlastData(payload);

    expect(result).toEqual({
      id: 1,
      name: "Test Blast",
      recipient_type: "group",
      status: "completed",
      message: "Hello World",
      phone_number: "1234567890",
      user_id: 1,
      vcm_transaction_id: "abc123",
      senderMask: "Test Mask",
      createdAt: "2022-01-01",
      updatedAt: "2022-01-02",
    });
  });
});
