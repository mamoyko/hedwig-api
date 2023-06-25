const SMS_BLAST_STATUSES = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  SENT: "sent",
  FAILED: "failed",
};

const RECIPIENT_TYPE = {
  MULTI: "multiple",
  SINGLE: "single",
};

const VCM_ENUM_STATUS_CODE = {
  200: "completed",
  400: "failed",
  401: "failed",
  503: "failed",
  511: "failed",
};

const RECIPIENT_TYPE_ENUMS = ["multiple", "single"];
const SMS_BLAST_STATUS_ENUMS = ["in-progress", "completed", "sent", "failed"];

const VCM_ERROR_MESSAGE = {
  401: "VCM: auth/unauthorized",
  400: "VCM: missing/invalid field",
};

const BLAST_ERROR_MESSAGE = {
  NO_VALID_RECIPIENTS: "Invalid blast: No valid recipients found",
};

module.exports = {
  SMS_BLAST_STATUSES,
  RECIPIENT_TYPE,
  VCM_ENUM_STATUS_CODE,
  RECIPIENT_TYPE_ENUMS,
  SMS_BLAST_STATUS_ENUMS,
  VCM_ERROR_MESSAGE,
  BLAST_ERROR_MESSAGE,
};
