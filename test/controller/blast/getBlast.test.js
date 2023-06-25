const BlastController = require("../../../controllers/BlastController");
const { RECIPIENT_TYPE } = require("../../../constants");
const { getBlastById, getMasterFile } = require("../../../utils");

jest.mock("../../../utils/blastUtils");
jest.mock("../../../utils/fileUtils");

describe("BlastController", () => {
  describe("getBlast", () => {
    test("should return blast details without file for single recipient", async () => {
      const mockBlast = {
        id: 1,
        subject: "Test blast",
        recipient_type: RECIPIENT_TYPE.SINGLE,
      };
      getBlastById.mockResolvedValueOnce(mockBlast);

      const req = { params: { blastId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await BlastController.getBlast(req, res);
    });

    test("should return blast details with file for multi recipient", async () => {
      const mockFile = {
        filename: "test.xlsx",
        invalid_recipients_file: {
          fileName: "invalid_recipients_test.xlsx",
        },
      };
      getMasterFile.mockResolvedValueOnce(mockFile);

      const req = { params: { blastId: 1 } };

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
      await BlastController.getBlast(req, res);
    });

    test("should return 500 status code and error message for internal server error", async () => {
      const mockError = new Error("Internal server error");
      getBlastById.mockRejectedValueOnce(mockError);

      const req = { params: { blastId: 1 } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await BlastController.getBlast(req, res);

      expect(getBlastById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: true,
        message: mockError.message,
      });
    });
  });
});
