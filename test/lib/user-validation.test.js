const { body, param } = require("express-validator");
const userValidation = require("../../lib/validations/users-validation");
const { FORM_VALIDATION } = require("../../lib/constants/error-codes");

describe("userValidation", () => {
  describe("login", () => {
    it("should return a validation function that checks for the presence of username and password", async () => {
      userValidation.login();
    });
  });

  describe("roleChange", () => {
    it("should return a validation function that checks for the presence of user_id and role", async () => {
      userValidation.roleChange();
    });
  });
});
