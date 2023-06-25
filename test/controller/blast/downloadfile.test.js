const BlastController = require("../../../controllers/BlastController");
const { getMasterFile } = require("../../../utils");
const { requestImageUrl } = require("../../../services/aws");

jest.mock("../../../utils/fileUtils");
jest.mock("../../../services/aws");

describe("BlastController - downloadFile", () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  test('should download the master file if type is not "invalid"', async () => {
    const req = {
      params: {
        blastId: "1",
      },
      query: {
        type: undefined,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const mockGetMasterFileResponse = {
      file_path: "path/to/master/file.csv",
      invalid_recipients_file: {
        key: "path/to/invalid/file.csv",
      },
    };
    getMasterFile.mockResolvedValue(mockGetMasterFileResponse);

    const mockS3Url = "https://example.com/path/to/master/file.csv";
    requestImageUrl.mockResolvedValue(mockS3Url);

    await BlastController.downloadFile(req, res, next);

    expect(getMasterFile).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockS3Url);
    expect(next).not.toHaveBeenCalled();
  });

  test('should download the invalid recipients file if type is "invalid"', async () => {
    const req = {
      params: {
        blastId: "1",
      },
      query: {
        type: "invalid",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const mockGetMasterFileResponse = {
      file_path: "path/to/master/file.csv",
      invalid_recipients_file: {
        key: "path/to/invalid/file.csv",
      },
    };
    getMasterFile.mockResolvedValue(mockGetMasterFileResponse);

    const mockS3Url = "https://example.com/path/to/master/file.csv";
    requestImageUrl.mockResolvedValue(mockS3Url);

    await BlastController.downloadFile(req, res, next);

    expect(getMasterFile).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockS3Url);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next with an error if an error occurs", async () => {
    const req = {
      params: {
        blastId: "1",
      },
      query: {
        type: undefined,
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    const mockError = new Error("Something went wrong");
    getMasterFile.mockRejectedValue(mockError);

    await BlastController.downloadFile(req, res, next);

    expect(getMasterFile).toHaveBeenCalledWith("1");
  });
});
