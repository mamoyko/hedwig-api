const FORM_VALIDATION = {code: 40000, message: 'Form Validation error'};

const AD_ACCOUNT_INVALID = {
  code: 40001,
  message: 'Invalid credentials or user is not in Hedwig console group',
};

const INVALID_USER_ID_DB = {
  code: 40002,
  message: 'Invalid user id or not found',
};

const UNAUTHORIZED_ACCESS = {
  code: 40001,
  message: 'You are not allowed to access this resource',
};

const ERROR_AUTHORIZATION_TOKEN = {
  code: 40001,
  message: 'No/Invalid authorization token',
};

const ERROR_EXPIRED_TOKEN = {
  code: 40001,
  message: 'Session Token Expired',
};

const ERROR_ROLE_NOT_AUTHORIZED = {
  code: 40004,
  message: 'User role is not authrorized to access this resource',
};

module.exports = {
  FORM_VALIDATION: FORM_VALIDATION,
  AD_ACCOUNT_INVALID: AD_ACCOUNT_INVALID,
  INVALID_USER_ID_DB: INVALID_USER_ID_DB,
  ERROR_AUTHORIZATION_TOKEN: ERROR_AUTHORIZATION_TOKEN,
  ERROR_ROLE_NOT_AUTHORIZED,
  UNAUTHORIZED_ACCESS,
  ERROR_EXPIRED_TOKEN,
};
