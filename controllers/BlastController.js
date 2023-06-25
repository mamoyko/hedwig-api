const fs = require("fs");
const to = require("await-to-js").default;
const moment = require("moment");
const logger = require("../lib/loggers");
const { upload, requestImageUrl } = require("../services/aws");

const BlastController = {};
const {
  createBlast,
  updateBlast,
  getBlastById,
  createMasterFileDetails,
  fileChunkParser,
  csvWriter,
  parseSplittedFileData,
  getUserByToken,
  getSenderMasks,
  parseFormData,
  getActivityList,
  getMasterFile,
  createFile,
  deleteFiles,
  parseBlastData,
  uploadToS3,
  getAndValidateExtractedData,
} = require("../utils");

const {
  SMS_BLAST_STATUSES,
  RECIPIENT_TYPE,
  VCM_ENUM_STATUS_CODE,
  VCM_ERROR_MESSAGE,
} = require("../constants");

const { VCMService } = require("../services");
const { sanitizedCsv } = require("../lib/validations/file-validation");
const { get } = require("lodash");

const logs = (level, message) => {
  logger.log(level, message);
};

BlastController.getBlast = async (req, res) => {
  try {
    const blastId = req.params.blastId;

    const blast = await getBlastById(blastId);
    const file = await getMasterFile(blastId);
    const senderMask = await getSenderMasks(blast.sender_masks_id);

    return res.status(200).json({
      blast: parseBlastData({ blast, senderMask }),
      ...(blast.recipient_type === RECIPIENT_TYPE.MULTI && {
        file: {
          master_file: get(file, "filename", null),
          invalid_mdns_file: get(
            file,
            "invalid_recipients_file.fileName",
            null
          ),
        },
      }),
    });
  } catch (error) {
    logs("error", `Error on getting blast: ${JSON.stringify(error)}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

BlastController.createBlast = async (req, res, next) => {
  /** for MULTI
   *  Current Flow WIP
   *  1. Create Blast Data
   *  2. upload and save the master file (main csv) details, extract blast needed.
   *  3. Extract data from the CSV
   *  4. Validated CSV phonenumbers
   *    a. msisdn uniqueness
   *    b. msisdn Format
   *    c. duplicate msisdn
   *  5. Parse blast message and phone number, AND create bulk csv
   *  6. Get File Bulk CSV
   *  7. Send to VCM
   *
   */

  const bearerToken = req.get("Authorization");
  const session_token = bearerToken.split(" ")[1];
  const user = await getUserByToken(session_token);
  let statusCode = 200;

  let errS3, uploadedData;

  const { name, recipient_type, message, sender_masks_id, phone_number } =
    req.body;

  const blast = await createBlast({
    name,
    recipient_type,
    message,
    sender_masks_id,
    user_id: user.id,
    status: SMS_BLAST_STATUSES.IN_PROGRESS,
    ...(recipient_type === RECIPIENT_TYPE.SINGLE && { phone_number }),
  });

  const sendMasks = await getSenderMasks(sender_masks_id);

  try {
    /**
     * Handle Multiple Recipient
     */
    if (recipient_type === RECIPIENT_TYPE.MULTI) {
      const { filename, path } = await sanitizedCsv(req.file);
      /**
       * Upload master file to s3 bucket
       */

      uploadedData = await uploadToS3({
        filePath: fs.createReadStream(path),
        key: `${blast.id}/${filename}`,
        type: "application/octet-stream",
      });

      const { validNumber, invalidNumber } = await getAndValidateExtractedData({
        filePath: path,
        fileName: filename,
        blastId: blast.id,
      });

      let invalidFile = null;

      if (invalidNumber.length > 0) {
        //saving invalid number
        const formatInvalidNumber = invalidNumber.map((item) => {
          return { phone: item };
        });

        const fileName = `invalid_recipient_${moment(new Date()).format(
          "YYYY-MM-DD"
        )}`;
        const newCsvInvalidNumber = await csvWriter(
          [formatInvalidNumber],
          fileName
        );

        [errS3, uploadedData] = await to(
          upload({
            Body: fs.createReadStream(newCsvInvalidNumber[0].fileWriter.path),
            Key: `${blast.id}/${fileName}.csv`,
            ContentType: "application/octet-stream",
          })
        );

        invalidFile = {
          key: uploadedData.Key,
          fileName,
        };

        if (errS3) {
          const error = {
            message: errS3,
            blastId: blast.id,
          };
          logs("error", `Error on upload AWS s3: ${JSON.stringify(error)}`);
          throw err;
        }
      }

      const masterFile = await createMasterFileDetails({
        filename: req.file.filename,
        file_path: `${blast.id}/${req.file.filename}`,
        blast_id: blast.id,
        invalid_recipients_file: invalidFile,
      });

      //saving valid number
      const chunkdata = await fileChunkParser(validNumber);
      const newCsv = await csvWriter(chunkdata);
      const parseNewCsv = await parseSplittedFileData(newCsv, masterFile);

      const sendVcmPromises = async () => {
        return await Promise.all(
          parseNewCsv.map(async (item) => {
            let body = parseFormData({
              appname: process.env.VCM_APPNAME,
              sender: get(sendMasks, "name", null),
              mask: get(sendMasks, "name", null),
              mode: "smsc",
              priority: 1,
              message,
              metadata: JSON.stringify({ blastId: blast.id }),
              msisdnFile: fs.createReadStream(item.file_path),
            });

            const { data } = await sendToVCM(body);
            logs("info", `Sending creating form data: ${blast.id}`);
            await createFile({
              master_file_id: masterFile.id,
              filename: item.filename,
              vcm_transaction_id: data.refId,
              blast_id: blast.id,
            });

            return data;
          })
        );
      };

      const sendToVCM = (body) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            logs("info", `sending sms to vcm: ${blast.id}`);
            resolve(VCMService.vcmSendSMS(body, "bulk"));
          }, 100);
        });
      };

      const [err, vcm] = await to(sendVcmPromises());
      if (err) {
        const error = {
          message: err,
          blastId: blast.id,
        };
        logs("error", `Error on VCM API:: ${error}`);
        statusCode = get(err, "response.data.status", 500);
        await updateBlast(blast.id, {
          status: VCM_ENUM_STATUS_CODE[statusCode],
        });
        throw new Error(VCM_ERROR_MESSAGE[statusCode]);
      } else {
        logs(
          "info",
          `Succesfully Send Blast message to VCM API:: transaction id =  ${get(
            vcm,
            "data.refId",
            null
          )}`
        );
      }

      await updateBlast(blast.id, {
        status: VCM_ENUM_STATUS_CODE[statusCode],
      });

      const updatedBlast = await getBlastById(blast.id);
      deleteFiles("tmp/new-csv-batch");
      deleteFiles("tmp/csv");
      logs("info", `Succesfully Created Blast::  blastId = ${blast.id}`);
      return res.json({ blast: updatedBlast });
    } else {
      /**
       * Handle single Recipient
       */
      const [err, vcm] = await to(
        VCMService.vcmSendSMS({
          appname: process.env.VCM_APPNAME,
          msisdn: phone_number,
          sender: sendMasks.name,
          mask: sendMasks.name,
          mode: "smsc",
          priority: 1,
          message,
          metadata: JSON.stringify({ blastId: blast.id }),
        })
      );

      if (err) {
        const error = {
          message: err,
          blastId: blast.id,
        };
        logs("error", `Error on VCM API:: ${error}`);
        statusCode = get(err, "response.data.status", 503);
        await updateBlast(blast.id, {
          status: VCM_ENUM_STATUS_CODE[statusCode],
        });
        throw new Error(VCM_ERROR_MESSAGE[statusCode]);
      } else {
        logs(
          "info",
          `Succesfully Send Blast message to VCM API:: transaction id = ${get(
            vcm,
            "data.refId",
            null
          )}`
        );
      }

      await updateBlast(blast.id, {
        vcm_transaction_id: get(vcm, "data.transactionId", null),
        status: VCM_ENUM_STATUS_CODE[statusCode],
      });

      const updatedBlast = await getBlastById(blast.id);

      return res.json({ blast: updatedBlast });
    }
  } catch (error) {
    await updateBlast(blast.id, {
      status: "failed",
    });
    logger.error(`Error on blast creation:: ${error}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

BlastController.getActivityList = async (req, res, next) => {
  try {
    const bearerToken = req.get("Authorization");
    const session_token = bearerToken.split(" ")[1];
    const user = await getUserByToken(session_token);
    const { limit = 10, page = 1 } = req.query;
    const [err, data] = await to(
      getActivityList({ limit, page, user_id: user.id })
    );
    if (err) return next(err.message);
    return res.status(200).json(data);
  } catch (error) {
    logs("error", `Error on getting activity list: ${JSON.stringify(error)}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

BlastController.downloadFile = async (req, res, next) => {
  try {
    const blastId = req.params.blastId;
    const type = req.query.type;
    const { file_path, invalid_recipients_file } = await getMasterFile(blastId);
    const fileName =
      type === "invalid" ? `${invalid_recipients_file.key}` : file_path;
    const [err, s3Url] = await to(requestImageUrl({ ObjectName: fileName }));
    if (err) {
      const error = {
        message: err,
        blastId: blast.id,
      };
      logs("error", `Error on upload AWS s3: ${JSON.stringify(error)}`);
      throw err;
    }

    return res.status(200).json(s3Url);
  } catch (error) {
    logs("error", `Error on downloading file: ${JSON.stringify(error)}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

BlastController.auditTrail = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const [err, data] = await to(getActivityList({ limit, page }));
    if (err) return next(err.message);
    return res.status(200).json(data);
  } catch (error) {
    logs("error", `Error on getting audi trail: ${JSON.stringify(error)}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = BlastController;
