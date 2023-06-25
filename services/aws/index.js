const { S3 } = require("aws-sdk");
const logger = require("../../lib/loggers");

const logs = (level, message) => {
  logger.log(level, message);
};

const getAwsConfig = () => {
  const {
    ACCESS_KEY_AWS,
    SECRET_KEY_AWS,
    REGION_AWS,
    S3_BUCKET_NAME,
    NODE_ENV,
  } = process.env;
  const awsConfig = {
    ...(NODE_ENV === "development" && { secretAccessKey: SECRET_KEY_AWS }),
    ...(NODE_ENV === "development" && { accessKeyId: ACCESS_KEY_AWS }),
    region: REGION_AWS,
    bucketName: S3_BUCKET_NAME,
    signatureVersion: "v4",
  };
  return awsConfig;
};

const upload = async (params) => {
  const awsConfig = getAwsConfig();
  const client = new S3(awsConfig);

  params.Bucket = `${awsConfig.bucketName}`;
  let data = await client.upload(params).promise();
  return data;
};

const requestImageUrl = async ({ ObjectName }) => {
  try {
    const awsConfig = getAwsConfig();
    const client = new S3(awsConfig);
    const params = {
      Bucket: `${awsConfig.bucketName}`,
      Key: ObjectName,
      Expires: 30,
    };
    const url = await client.getSignedUrlPromise("getObject", params);
    return url;
  } catch (err) {
    logs("error", JSON.stringify(error));
    throw err;
  }
};

module.exports = {
  upload,
  requestImageUrl,
};
