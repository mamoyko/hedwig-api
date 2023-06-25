const {
  BlastValidation,
  validatePhoneNumber,
} = require("../../lib/validations/blast-validation");

describe("BlastValidation", () => {
  test("should pass validation", async () => {
    const req = {
      body: {
        name: "test",
        recipient_type: "single",
        sender_masks_id: "1234",
        message: "hello",
        phone_number: "639123456789",
      },
    };
    const res = {};
    const next = jest.fn();
    await BlastValidation.create()(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("should fail validation when recipient type is multi and file is missing", async () => {
    const req = {
      body: {
        name: "test",
        recipient_type: "multi",
        sender_masks_id: "1234",
        message: "hello",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    await BlastValidation.create()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should fail validation when recipient type is single and phone number is invalid", async () => {
    const req = {
      body: {
        name: "test",
        recipient_type: "single",
        sender_masks_id: "1234",
        message: "hello",
        phone_number: "123456789",
      },
    };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();
    await BlastValidation.create()(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: "Invalid Number" }),
        ]),
      })
    );
  });
});

describe("validatePhoneNumber", () => {
  test("should return true for valid phone number", () => {
    expect(validatePhoneNumber("639123456789")).toBe(true);
  });

  test("should return false for invalid phone number", () => {
    expect(validatePhoneNumber("123456789")).toBe(false);
  });
});
