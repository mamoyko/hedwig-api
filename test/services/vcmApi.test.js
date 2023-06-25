const axios = require("axios");

const {
  sendsms,
  getSmsDetails,
} = require("../../services/voyager-cloud-messaging/api");

jest.mock("axios");

describe("sendsms", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should send SMS successfully", async () => {
    const payload = {
      /* your payload here */
    };
    const expectedResponse = {
      /* your expected response here */
    };
    axios.mockResolvedValueOnce({ data: expectedResponse });

    await sendsms(payload);
  });

  it("should throw an error if there's an issue sending SMS", async () => {
    const payload = {
      /* your payload here */
    };
    const expectedError = new Error("Failed to send SMS");
    axios.mockRejectedValueOnce(expectedError);

    await expect(sendsms(payload)).rejects.toThrow(expectedError);
    expect(axios).toHaveBeenCalledTimes(1);
  });
});

describe("getSmsDetails", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get SMS details successfully", async () => {
    const payload = { id: "123", appname: "example-app", type: "example-type" };
    const expectedResponse = {
      /* your expected response here */
    };
    axios.mockResolvedValueOnce({ data: expectedResponse });

    await getSmsDetails(payload);
  });

  it("should throw an error if there's an issue getting SMS details", async () => {
    const payload = { id: "123" };
    const expectedError = new Error("Failed to get SMS details");
    axios.mockRejectedValueOnce(expectedError);

    await expect(getSmsDetails(payload)).rejects.toThrow(expectedError);
  });
});
