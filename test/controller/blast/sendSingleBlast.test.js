const BlastController = require("../../../controllers/BlastController");
const {
  getUserByToken,
  getSenderMasks,
  createBlast,
} = require("../../../utils");
const { VCMService } = require("../../../services");
const { RECIPIENT_TYPE } = require("../../../constants");

jest.mock("../../../utils/userUtils");
jest.mock("../../../utils/senderMasksUtils");
jest.mock("../../../utils/blastUtils");
jest.mock("../../../services/voyager-cloud-messaging");

describe("BlastController.createBlast", () => {
  test("creates a new blast", async () => {
    const req = {
      body: {
        name: "Test Blast",
        recipient_type: RECIPIENT_TYPE.SINGLE,
        message: "Hello, world!",
        sender_masks_id: "sender-mask-123",
        phone_number: "+1234567890",
      },
      get: jest.fn(() => "fake-auth-token"),
    };
    const res = {
      json: jest.fn(() => {}),
      status: jest.fn(() => res),
    };
    const next = jest.fn(() => {});

    getUserByToken.mockResolvedValue({ id: 1 });
    getSenderMasks.mockResolvedValue({ id: 1, name: "Maya" });
    createBlast.mockResolvedValue({ id: 1 });
    VCMService.vcmSendSMS.mockResolvedValue([
      null,
      { data: { transactionId: "dummy-transaction-id" } },
    ]);

    await BlastController.createBlast(req, res, next);
  });
});
