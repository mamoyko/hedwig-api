// const db = require("../../models");
// const { getActivityList } = require("../../utils/activityListUtils");

// jest.mock("../../models");

// describe("getActivityList", () => {
//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   it("should return activity list", async () => {
//     // Arrange
//     const params = { limit: 10, page: 1, user_id: "1234" };
//     const countSQL =
//       "SELECT COUNT(*) as total_count from SmsBlasts as sb INNER JOIN SenderMasks sm ON sm.id = sb.sender_masks_id WHERE 1=1 AND sb.user_id = '1234'";
//     const sql =
//       "SELECT sb.id as blast_id, sm.id as sender_masks_id, sm.name as sender_mask_name, sb.name as blast_name, sb.recipient_type as recipient_type, sb.status as status, sb.createdAt as createdAt from SmsBlasts as sb INNER JOIN SenderMasks sm ON sm.id = sb.sender_masks_id WHERE 1=1 AND sb.user_id = '1234' ORDER BY sb.createdAt DESC LIMIT 10 OFFSET 0";

//     const mockData = [
//       [
//         {
//           blast_id: 1,
//           sender_masks_id: 2,
//           sender_mask_name: "sender_mask_name",
//           blast_name: "blast_name",
//           recipient_type: "recipient_type",
//           status: "status",
//           createdAt: "2022-04-04 12:00:00",
//         },
//       ],
//     ];

//     const countQueryResult = [[{ total_count: 1 }]];

//     db.sequelize.query.mockImplementation((query) => {
//       if (query.replace(/\s+/g, "") == countSQL.replace(/\s+/g, "")) {
//         return countQueryResult;
//       } else if (query.replace(/\s+/g, "") == sql.replace(/\s+/g, "")) {
//         return mockData;
//       }
//     });

//     // Act
//     await getActivityList(params);

//     // Assert
//     // expect(db.sequelize.query).toHaveBeenCalledTimes(2);
//   });

//   it("should throw an error when query fails", async () => {
//     // Arrange
//     const params = { limit: 10, page: 1, user_id: "1234" };
//     db.sequelize.query.mockRejectedValue(new Error("Query failed"));
//     await expect(getActivityList(params)).rejects.toThrow("Query failed");
//   });
// });

const db = require("../../models");
const { getActivityList } = require("../../utils/activityListUtils");

jest.mock("../../models");

describe("getActivityList", () => {
  afterEach(() => {
    jest.resetAllMocks(); // Reset the mock after each test
  });

  test("returns correct data", async () => {
    // Mock the database response
    const data = [
      [
        { id: 1, name: "activity 1" },
        { id: 2, name: "activity 2" },
      ],
    ];
    const count = [[{ total_count: 2 }]];
    db.sequelize.query.mockResolvedValueOnce(count);
    db.sequelize.query.mockResolvedValueOnce(data);

    // Call the function with test data
    const params = {
      /* your test params */
    };
    const result = await getActivityList(params);

    // Check that the function returned the correct data
    expect(result.list).toEqual(data[0]);
    expect(result.total_count).toBe(2);

    // Check that the database was called with the correct SQL queries
    expect(db.sequelize.query).toHaveBeenCalledTimes(2);
  });

  test("throws error if database query fails", async () => {
    // Mock the database response to throw an error
    const error = new Error("Database error");
    db.sequelize.query.mockRejectedValueOnce(error);

    // Call the function with test data
    const params = {
      /* your test params */
    };

    // Check that the function throws the expected error
    await expect(getActivityList(params)).rejects.toThrow(error);

    // Check that the error was logged correctly
    // expect(logs).toHaveBeenCalledWith(
    //   "error",
    //   `Sequelize error on getting activity list SQL: ${JSON.stringify(error)}`
    // );
  });
});
