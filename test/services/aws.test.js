const { S3 } = require("aws-sdk");
const { upload, requestImageUrl } = require("../../services/aws");

// mock the S3 client
jest.mock("aws-sdk", () => ({
  S3: jest.fn().mockImplementation(() => ({
    upload: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue("uploaded"),
    }),
    getSignedUrlPromise: jest.fn().mockResolvedValue("signed_url"),
  })),
}));

describe("upload function", () => {
  test("calls the S3 client with the correct params", async () => {
    const params = {
      Bucket: "your_bucket_name",
      Key: "your_object_key",
      Body: "your_object_body",
    };
    await upload(params);
  });

  test("returns the uploaded data", async () => {
    const params = {
      Bucket: "your_bucket_name",
      Key: "your_object_key",
      Body: "your_object_body",
    };
    await upload(params);
  });
});

describe("requestImageUrl function", () => {
  test("calls the S3 client with the correct params", async () => {
    const params = {
      ObjectName: "your_object_name",
    };
    await requestImageUrl(params);
  });

  test("returns the signed URL", async () => {
    const params = {
      ObjectName: "your_object_name",
    };
    await requestImageUrl(params);
  });
});
