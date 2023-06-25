const { VCMService } = require("../../services");

const {
  sendsms,
  getSmsDetails,
} = require("../../services/voyager-cloud-messaging/api");

jest.mock("../../services/voyager-cloud-messaging/api", () => ({
  sendsms: jest.fn(),
  getSmsDetails: jest.fn(),
}));

describe("vcmSendSMS", () => {
  test("sends SMS successfully", async () => {
    // Call the vcmSendSMS function with some payload and type
    const payload = { message: "Hello world", phone: "1234567890" };
    const type = "text";
    await VCMService.vcmSendSMS(payload, type);
  });
  test("gets SMS details successfully", async () => {
    const payload = { messageId: 123 };
    await VCMService.vcmGetDetails(payload);
  });
});
