const {validationResult} = require('express-validator');
const {FORM_VALIDATION} = require('../constants/error-codes');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    res.status(400).json({...FORM_VALIDATION, errors: errors.errors});
  };
};

module.exports = validate;
