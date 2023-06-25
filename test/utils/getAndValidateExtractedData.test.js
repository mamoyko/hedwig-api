const { getAndValidateExtractedData, blastValidation } = require("../../utils");
const path = require("path");

jest.mock("../../utils/fileUtils", () => ({
  blastValidation: jest.fn(() => ({
    validNumber: 5,
    invalidNumber: 3,
  })),
}));

describe("getAndValidateExtractedData function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should extract and validate CSV data correctly", async () => {
    // Arrange
    const mockLogs = jest.fn();
    const mockCsvData = [
      { field1: "value1", field2: "value2" },
      { field1: "value3", field2: "value4" },
      { field1: "value5", field2: "value6" },
    ];
    const filePath = path.join(__dirname, "../files/test.csv");
    const mockPayload = { filePath, blastId: 123 };

    // Act
    await getAndValidateExtractedData(mockPayload);

    expect(blastValidation).toHaveBeenCalledTimes(1);
  });
});
