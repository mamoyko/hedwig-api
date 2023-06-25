const { body } = require("express-validator");
const validationWrapper = require("./validation-wrappers");
const { RECIPIENT_TYPE } = require("../../constants");

const BlastValidation = {};

BlastValidation.create = () => {
  return validationWrapper([
    body("name")
      .notEmpty()
      .withMessage("name field is required")
      .matches(/^[\w-. ]+$/i),
    body("recipient_type")
      .notEmpty()
      .withMessage("recipient type field is required")
      .matches(/\b(?:multiple|single)\b/),
    body("sender_masks_id")
      .notEmpty()
      .withMessage("sender masks id field is required"),
    body("recipient_type").custom((value, { req }) => {
      if (value === RECIPIENT_TYPE.MULTI && !req.file) {
        throw new Error("File field is required");
      }
      return true;
    }),
    body("message")
      .notEmpty()
      .withMessage("message field is required")
      .custom((value, { req }) => {
        if (value.length > 800)
          throw new Error("Text must not exceed 800 character");
        return true;
      }),
    body("phone_number").custom((value, { req }) => {
      if (
        req.body.recipient_type === RECIPIENT_TYPE.SINGLE &&
        !validatePhoneNumber(value)
      ) {
        throw new Error("Invalid Number");
      }
      return true;
    }),
  ]);
};

const validatePhoneNumber = (number) => {
  const regex = /^(639)\d{9}$/gm;
  return regex.test(number);
};

module.exports = {
  validatePhoneNumber,
  BlastValidation,
};
