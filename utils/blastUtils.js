const FormData = require("form-data");
const { SmsBlasts } = require("../models");
const logger = require("../lib/loggers");
const { VCM_ENUM_STATUS_CODE, BLAST_ERROR_MESSAGE } = require("../constants");
const { blastValidation, createMasterFileDetails } = require("./fileUtils");
const { uploadToS3 } = require("./awsUtils");
const csv = require("csvtojson");
const moment = require("moment");

const logs = (level, message) => {
  logger.log(level, message);
};

const createBlast = async (payload) => {
  const blast = await SmsBlasts.create(payload);
  return blast;
};

const updateBlast = async (id, payload) => {
  const blast = await SmsBlasts.update(payload, { where: { id } });
  return blast;
};

const getBlastById = async (id) => {
  const blast = await SmsBlasts.findOne({ where: { id } });
  return blast;
};

const parseFormData = (payload) => {
  const body = new FormData();
  const keys = Object.keys(payload);
  keys.forEach((key) => {
    body.append(key, payload[key]);
  });
  return body;
};

const parseBlastData = (payload) => {
  const { blast, senderMask } = payload;
  const {
    id,
    name,
    recipient_type,
    status,
    message,
    phone_number,
    user_id,
    vcm_transaction_id,
    createdAt,
    updatedAt,
  } = blast;
  return {
    id,
    name,
    recipient_type,
    status,
    message,
    phone_number,
    user_id,
    vcm_transaction_id,
    senderMask: senderMask.name,
    createdAt,
    updatedAt,
  };
};

const getAndValidateExtractedData = async ({ filePath, fileName, blastId }) => {
  let extractedData = await csv({
    noheader: true,
    trim: true,
    quote: "double quote",
  }).fromFile(filePath);
  logs(
    "info",
    `Extracted data of ${extractedData.length}:: blastId: ${blastId}`
  );
  const { validNumber, invalidNumber } = await blastValidation(extractedData);
  await validateExtractedNumbers({
    validNumber,
    invalidNumber,
    blastId,
    filePath,
    fileName,
  });
  return {
    validNumber,
    invalidNumber,
  };
};

const validateExtractedNumbers = async ({
  validNumber,
  invalidNumber,
  blastId,
  filePath,
  fileName,
}) => {
  if (validNumber.length <= 0)
    await handleNoValidNumber({
      validNumber,
      blastId,
      filePath,
      fileName,
    });
};

const handleNoValidNumber = async ({
  blastId,
  filePath,
  fileName,
  isEmpty = false,
}) => {
  const errorFileName = `invalid_recipient_${moment(new Date()).format(
    "YYYY-MM-DD"
  )}`;
  const uploadedData = await uploadToS3({
    filePath,
    key: `${blastId}/${errorFileName}.csv`,
    type: "application/octet-stream",
    isEmpty,
  });

  let invalidFile = {
    key: uploadedData.Key,
    errorFileName,
  };

  let masterFile = await createMasterFileDetails({
    filename: fileName,
    file_path: `${blastId}/${fileName}`,
    blast_id: blastId,
    invalid_recipients_file: invalidFile,
  });

  logs("info", `Created masterfile:: ${masterFile.id}`);

  const error = {
    message: BLAST_ERROR_MESSAGE.NO_VALID_RECIPIENTS,
    blastId: blastId,
  };

  logs("error", `Error on VCM API:: ${error}`);
  const statusCode = 503;
  await updateBlast(blastId, {
    status: VCM_ENUM_STATUS_CODE[statusCode],
  });
  throw new Error(BLAST_ERROR_MESSAGE.NO_VALID_RECIPIENTS);
};

module.exports = {
  createBlast,
  updateBlast,
  getBlastById,
  parseFormData,
  parseBlastData,
  uploadToS3,
  getAndValidateExtractedData,
  handleNoValidNumber,
};
