const { upload } = require("../services/aws");
const { updateBlast } = require("./blastUtils");
const logger = require("../lib/loggers");
const { VCM_ENUM_STATUS_CODE } = require("../constants");

const logs = (level, message) => {
  logger.log(level, message);
};

const uploadToS3 = async (payload) => {
  try {
    const { filePath, key, type } = payload;
    let uploads3 = await upload({
      Body: filePath,
      Key: key,
      ContentType: type,
    });
    logs("info", `Successfully upload to s3 ${JSON.stringify(uploads3)}`);
    return uploads3;
  } catch (error) {
    await updateBlast(blast.id, {
      status: VCM_ENUM_STATUS_CODE[511],
    });
    const parseError = {
      message: errS3,
      blastId: blast.id,
    };
    logs("error", `Error on upload AWS s3: ${JSON.stringify(parseError)}`);
    throw error;
  }
};

module.exports = {
  uploadToS3,
};
