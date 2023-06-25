const fs = require("fs");

const { MasterFiles, SplittedFiles } = require("../../models");

const {
  createMasterFileDetails,
  createSplittedFile,
  findSplittedFile,
  createFile,
  getMasterFile,
  blastValidation,
  fileChunkParser,
  csvWriter,
  parseSplittedFileData,
  deleteFiles,
} = require("../../utils/fileUtils");

const masterFileMockData = {
  id: "1",
  filename: "40k.csv",
  filepath: "d7b18840-49a1-4656-a7d6-47f41fffdfe1/40k.csv",
  blast_id: "d7b18840-49a1-4656-a7d6-47f41fffdfe1",
  invalid_recipient_file:
    '{"key": "d7b18840-49a1-4656-a7d6-47f41fffdfe1/invalid_recipient_2023-03-29.csv", "fileName": "invalid_recipient_2023-03-29"}',
  createdAt: "2023-03-30 01:39:05",
  updatedAt: "2023-03-30 01:39:08",
};

const bulkSplittedFilesMockData = [
  {
    id: "1",
    filename: "40k.csv",
    filepath: "d7b18840-49a1-4656-a7d6-47f41fffdfe1/40k.csv",
    vcm_transaction_id: "291c0c20-ce21-11ed-9b3b-631af710d85b",
    master_file_id: "1",
    blast_id: "d7b18840-49a1-4656-a7d6-47f41fffdfe1",
    createdAt: "2023-03-30 01:39:05",
    updatedAt: "2023-03-30 01:39:08",
  },
];

const numbers = [
  {
    field1: "639900000xssgs",
  },
  {
    field1: "639900000xssgs",
  },
  {
    field1: "639900000xssgs",
  },
  {
    field1: "639900000xssgs",
  },
  {
    field1: "639900000xssgs",
  },
  {
    field1: "639900000001",
  },
  {
    field1: "639900000008",
  },
  {
    field1: "639900000009",
  },
  {
    field1: "639900000010",
  },
  {
    field1: "639900000011",
  },
];

const validNumber = [
  "639900000001",
  "639900000008",
  "639900000009",
  "639900000010",
  "639900000011",
  "639900000012",
  "639900000013",
  "639900000014",
  "639900000015",
  "639900000016",
];

let chunkDataMock = [
  [
    { phone: "639900000001" },
    { phone: "639900000008" },
    { phone: "639900000009" },
    { phone: "639900000010" },
  ],
  [
    { phone: "639900000011" },
    { phone: "639900000012" },
    { phone: "639900000013" },
    { phone: "639900000014" },
  ],
  [{ phone: "639900000015" }, { phone: "639900000016" }],
];

let newCsv = [
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
      path: "tmp/new-csv-batch/batch_202304052023-04-04T15:46:32.981Z-1.csv",
      append: false,
      encoding: "utf8",
    },
  },
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
      path: "tmp/new-csv-batch/batch_202304052023-04-04T15:46:32.997Z-2.csv",
      append: false,
      encoding: "utf8",
    },
  },
];

jest.mock("../../models");

describe("File services", () => {
  beforeEach(() => {
    fs.unlink = jest.fn();
  });
  afterEach(() => {
    // Restore the fs module's unlink function
    jest.restoreAllMocks();
  });

  test("should create a new master file", (done) => {
    MasterFiles.create.mockResolvedValueOnce(masterFileMockData);
    createMasterFileDetails(masterFileMockData).then((results) => {
      expect(results).toEqual(masterFileMockData);
      done();
    });
  });

  test("should create bulk splitted file", (done) => {
    SplittedFiles.bulkCreate.mockResolvedValueOnce(bulkSplittedFilesMockData);
    createSplittedFile(bulkSplittedFilesMockData).then((results) => {
      expect(results).toEqual(bulkSplittedFilesMockData);
      done();
    });
  });

  test("should find all splitted file", (done) => {
    SplittedFiles.findAll.mockResolvedValueOnce(bulkSplittedFilesMockData);
    findSplittedFile(bulkSplittedFilesMockData).then((results) => {
      expect(results).toEqual(bulkSplittedFilesMockData);
      done();
    });
  });

  test("should create splitted file", (done) => {
    SplittedFiles.create.mockResolvedValueOnce(bulkSplittedFilesMockData[0]);
    createFile(bulkSplittedFilesMockData[0]).then((results) => {
      expect(results).toEqual(bulkSplittedFilesMockData[0]);
      done();
    });
  });

  test("should find master file", (done) => {
    MasterFiles.findOne.mockResolvedValueOnce(masterFileMockData);
    getMasterFile(masterFileMockData.blast_id).then((results) => {
      expect(results).toEqual(masterFileMockData);
      done();
    });
  });

  test("should validate number", (done) => {
    blastValidation(numbers).then((results) => {
      expect(results).toHaveProperty("validNumber");
      expect(results).toHaveProperty("invalidNumber");
      done();
    });
  });

  test("should chunk validnumber", async () => {
    let chunkData = await fileChunkParser(validNumber);
    expect(chunkData[0][0]).toHaveProperty("phone");
  });

  test("should return write csv using csvwritter", async () => {
    let results = await csvWriter(chunkDataMock);
    expect(results).toHaveLength(3);
  });

  test("should return parse data for splitted file", async () => {
    let results = await parseSplittedFileData(newCsv, masterFileMockData);
    expect(results[0]).toHaveProperty("file_path");
    expect(results[0]).toHaveProperty("filename");
    expect(results[0]).toHaveProperty("blast_id");
    expect(results[0]).toHaveProperty("master_file_id");
  });

  test("deletes all files in directory", () => {
    const path = "./test-directory";

    // Mock the fs module's readdir function
    jest.spyOn(fs, "readdir").mockImplementation((path, callback) => {
      callback(null, ["file1.txt", "file2.txt", "file3.txt"]);
    });

    // Call the deleteFiles function
    deleteFiles(path);

    // Assert that fs.unlink was called for each file in the directory
    expect(fs.unlink).toHaveBeenCalledTimes(3);
    expect(fs.unlink).toHaveBeenCalledWith(
      `${path}/file1.txt`,
      expect.any(Function)
    );
    expect(fs.unlink).toHaveBeenCalledWith(
      `${path}/file2.txt`,
      expect.any(Function)
    );
    expect(fs.unlink).toHaveBeenCalledWith(
      `${path}/file3.txt`,
      expect.any(Function)
    );
  });

  test("throws an error if there is an error deleting a file", () => {
    const path = "./test-directory";

    // Mock the fs module's readdir function
    jest.spyOn(fs, "readdir").mockImplementation((path, callback) => {
      callback(null, ["file1.txt", "file2.txt", "file3.txt"]);
    });

    // Mock the fs module's unlink function to throw an error
    fs.unlink.mockImplementation((path, callback) => {
      callback(new Error("Error deleting file"));
    });

    // Call the deleteFiles function and expect it to throw an error
    expect(() => {
      deleteFiles(path);
    }).toThrowError("Error deleting file");
  });
});
