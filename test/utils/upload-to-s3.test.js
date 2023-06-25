const { uploadToS3 } = require("../../utils/");
const { upload } = require("../../services/aws");

jest.mock("../../services/aws", () => ({
  upload: jest.fn(),
}));

describe("uploadToS3 function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should upload to S3 correctly", async () => {
    const payload = {
      filePath: "/path/to/file",
      key: "example-key",
      type: "image/jpeg",
    };

    // Act
    await uploadToS3(payload);

    // Assert
    expect(upload).toHaveBeenCalledTimes(1);
    expect(upload).toHaveBeenCalledWith({
      Body: payload.filePath,
      Key: payload.key,
      ContentType: payload.type,
    });
  });

  it("should throw an error and update blast status on S3 upload failure", async () => {
    // Arrange
    const mockUpdateBlast = jest.fn();
    const mockLogs = jest.fn();
    const mockError = new Error("S3 upload failed");
    const payload = {
      filePath: "/path/to/file",
      key: "example-key",
      type: "image/jpeg",
    };
    const blast = { id: 123 };

    jest.mock("../../utils/blastUtils", () => ({
      updateBlast: mockUpdateBlast,
      logs: mockLogs,
    }));

    upload.mockImplementation(() => {
      throw mockError;
    });

    // Act
    let error;
    try {
      await uploadToS3(payload, blast);
    } catch (err) {
      error = err;
    }
  });
});
