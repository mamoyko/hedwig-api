const redisClient = require("../../lib/redis/redis-client");
const {
  redisSetKey,
  redisSetExpire,
  redisGetAllKeys,
  redisDeleteKey,
} = require("../../utils/redisUtils");

jest.mock("../../lib/redis/redis-client");

describe("Redis Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("redisSetKey should call redisClient.hSet", async () => {
    const email = "test@test.com";
    const token = "token123";

    await redisSetKey(email, token);

    expect(redisClient.hSet).toHaveBeenCalledTimes(1);
    expect(redisClient.hSet).toHaveBeenCalledWith(email, token);
  });

  test("redisSetExpire should call redisClient.expire", async () => {
    const email = "test@test.com";
    const duration = 300;

    await redisSetExpire(email, duration);

    expect(redisClient.expire).toHaveBeenCalledTimes(1);
    expect(redisClient.expire).toHaveBeenCalledWith(email, duration);
  });

  test("redisGetAllKeys should call redisClient.hGetAll", async () => {
    const username = "testuser";

    redisClient.hGetAll.mockResolvedValueOnce({
      key1: "value1",
      key2: "value2",
    });

    const result = await redisGetAllKeys(username);

    expect(redisClient.hGetAll).toHaveBeenCalledTimes(1);
    expect(redisClient.hGetAll).toHaveBeenCalledWith(username);
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  test("redisDeleteKey should call redisClient.del", async () => {
    const key = "testkey";

    redisClient.del.mockResolvedValueOnce(1);

    const result = await redisDeleteKey(key);

    expect(redisClient.del).toHaveBeenCalledTimes(1);
    expect(redisClient.del).toHaveBeenCalledWith(key);
    expect(result).toEqual(1);
  });
});
