const { body, param } = require("express-validator");
const validationWrapper = require("./validation-wrappers");

const userValidation = {};

userValidation.login = () => {
  return validationWrapper([
    body("username")
      .exists()
      .withMessage("username field is required")
      .bail()
      .not()
      .isEmpty()
      .withMessage("username field should have a value"),
    body("password")
      .exists()
      .withMessage("password field is required")
      .bail()
      .not()
      .isEmpty()
      .withMessage("password field should have a value"),
  ]);
};

userValidation.roleChange = () => {
  return validationWrapper([
    param("user_id")
      .exists()
      .withMessage("user param is required")
      .bail()
      .not()
      .isEmpty()
      .withMessage("user_id param should have a value"),
    body("role")
      .exists()
      .withMessage("role is required")
      .bail()
      .not()
      .isEmpty()
      .withMessage("role should have a value"),
  ]);
};

module.exports = userValidation;
