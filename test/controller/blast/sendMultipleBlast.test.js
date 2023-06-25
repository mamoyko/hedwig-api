const BlastController = require("../../../controllers/BlastController");
const {
  getUserByToken,
  getSenderMasks,
  createMasterFileDetails,
  blastValidation,
  fileChunkParser,
  csvWriter,
  parseSplittedFileData,
  createBlast,
  parseFormData,
  updateBlast,
  getAndValidateExtractedData,
} = require("../../../utils");
const csv = require("csvtojson");
const { upload, requestImageUrl } = require("../../../services/aws");
const { vcmSendSMS } = require("../../../services/voyager-cloud-messaging");
const moment = require("moment");

// const fs = require("fs");
const path = require("path");

jest.mock("../../../utils/userUtils");
jest.mock("../../../utils/senderMasksUtils");
jest.mock("../../../utils/fileUtils");
jest.mock("../../../utils/blastUtils");
jest.mock("../../../services/aws");
jest.mock("../../../services/voyager-cloud-messaging");

describe("BlastController", () => {
  describe("createBlast", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const user = {
      id: "ae3f099a-1d47-407b-8774-644d5d79cfee",
      email: "p.joel.balignasay@paymaya.com",
      role: 2,
      firstname: "Joel",
      lastname: "Balignasay",
      createdAt: "2023-03-29T11:02:05.000Z",
      updatedAt: "2023-03-29T11:02:05.000Z",
    };

    const senderMasks = {
      id: 9,
      name: "MayaTest",
      createdAt: "2023-03-29T07:44:54.000Z",
      updatedAt: "2023-03-29T07:44:54.000Z",
    };

    const blasts = {
      id: "70520dd8-21c6-4bb8-a2bd-0c1b6e2d3878",
      name: "sender bkast v2",
      recipient_type: "multiple",
      message: "test from maya - IM TESTING AGAIN'",
      sender_masks_id: "9",
      user_id: "ae3f099a-1d47-407b-8774-644d5d79cfee",
      status: "in-progress",
      updatedAt: "2023-04-18T06:01:05.168Z",
      createdAt: "2023-04-18T06:01:05.168Z",
    };

    const session_token = "Bearer token";
    const filePath = path.join(__dirname, "../../files/test.csv");
    const req = {
      body: {
        name: "sender bkast v2",
        recipient_type: "multiple",
        message: "test from maya - IM TESTING AGAIN'",
        sender_masks_id: "9",
      },
      file: {
        path: filePath,
        filename: "test.csv",
      },
      get: () => session_token,
    };
    const res = {
      json: jest.fn(),
      status: jest.fn(),
    };
    const next = jest.fn();

    test("should handle creating a blast with multiple recipients", async () => {
      getUserByToken.mockResolvedValue(user);
      getSenderMasks.mockResolvedValue(senderMasks);
      createBlast.mockResolvedValue(blasts);
      upload.mockResolvedValue({
        Key: "path/to/file.csv",
      });

      getAndValidateExtractedData.mockResolvedValue({
        validNumber: [
          "639900000001",
          "639900000008",
          "639900000009",
          "639900000010",
        ],
        invalidNumber: [],
      });
      createMasterFileDetails.mockResolvedValue({
        id: 38,
        filename: "40k.csv",
        file_path: "cc59d40e-abc1-4cc2-a6cb-9635b196696a/40k.csv",
        blast_id: "cc59d40e-abc1-4cc2-a6cb-9635b196696a",
        invalid_recipients_file: {
          key: "cc59d40e-abc1-4cc2-a6cb-9635b196696a/invalid_recipient_2023-04-18.csv",
          fileName: "invalid_recipient_2023-04-18",
        },
        updatedAt: "2023-04-18T09:05:42.783Z",
        createdAt: "2023-04-18T09:05:42.783Z",
      });

      fileChunkParser.mockResolvedValue([
        [
          {
            phone: "639958902064",
          },
          {
            phone: "639958902065",
          },
          {
            phone: "639958902066",
          },
          {
            phone: "639958902067",
          },
          {
            phone: "639958902068",
          },
          {
            phone: "639958902069",
          },
        ],
      ]);
      csvWriter.mockResolvedValue([
        {
          csvStringifier: {
            fieldStringifier: {
              fieldDelimiter: ",",
            },
            recordDelimiter: "\n",
            header: ["phone"],
          },
          append: false,
          fileWriter: {
            path: path.join(__dirname, "../../files/batch.csv"),
            append: false,
            encoding: "utf8",
          },
        },
      ]);
      parseSplittedFileData.mockResolvedValue([
        {
          file_path: path.join(__dirname, "../../files/batch.csv"),
          filename: "batch_202304192023-04-18T10:10:47.115Z-1.csv",
          blast_id: "e2604399-dddc-4e3b-85f0-ec8a3f89f2f2",
          master_file_id: 42,
        },
      ]);
      parseFormData.mockResolvedValue({});

      vcmSendSMS.mockResolvedValue({
        data: {
          status: 200,
          refId: "5cf31dd0-ddd6-11ed-9b3b-631af710d85b",
        },
      });

      await BlastController.createBlast(req, res, next);
    });
  });
});
