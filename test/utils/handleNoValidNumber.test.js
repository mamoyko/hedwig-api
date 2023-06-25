const { handleNoValidNumber, createMasterFileDetails } = require("../../utils");
const { SmsBlasts } = require("../../models");
const { uploadToS3 } = require("../../utils/awsUtils");
const { BLAST_ERROR_MESSAGE } = require("../../constants");

jest.mock("../../utils/awsUtils");
jest.mock("../../utils/fileUtils");
jest.mock("../../models");

describe("handleNoValidNumber", () => {
  test("throws an error with the correct message", async () => {
    uploadToS3.mockResolvedValueOnce({ Key: "some_key" });
    createMasterFileDetails.mockResolvedValueOnce({ id: "some_id" });
    SmsBlasts.update.mockResolvedValueOnce({});

    // Call the function and expect it to throw an error.
    await expect(
      handleNoValidNumber({
        blastId: "some_id",
        filePath: "some_path",
        fileName: "some_name",
        isEmpty: true,
      })
    ).rejects.toThrow(BLAST_ERROR_MESSAGE.NO_VALID_RECIPIENTS);
  });
});
