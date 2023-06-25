const axios = require("axios");
const logger = require("../../lib/loggers");

const logs = (level, message) => {
  logger.log(level, message);
};

const encodeAuth = Buffer.from(
  `${process.env.VCM_CLIENT_ID}:${process.env.VCM_CLIENT_SECRET}`
).toString("base64");

const basicAuth = `Basic ${encodeAuth}`;

const baseUrl = process.env.VCM_URL;
const version = "v2";

const client = async ({ url, method, data }) => {
  const { headers, payload } = data;
  const response = await axios({
    method,
    url,
    headers,
    ...(payload && { data: payload }),
  });
  return response;
};

const post = (params) => client({ ...params, method: "POST" });
const get = (params) => client({ ...params, method: "GET" });

const sendsms = async (payload, type) => {
  try {
    let url = `${baseUrl}/${version}/sms`;
    if (type) url += `?type=${type}`;
    const response = await post({
      url,
      data: {
        headers: {
          Authorization: basicAuth,
          ...(type && {
            "Content-type": `multipart/form-data; boundary=${payload._boundary}`,
          }),
        },
        payload,
      },
    });
    return response;
  } catch (error) {
    logs("error", JSON.stringify(error));
    throw error;
  }
};

const getSmsDetails = async (payload) => {
  try {
    const { id, appname, type } = payload;
    let url = `${baseUrl}/${version}/sms/${id}`;
    if (appname) url += `?appname=${appname}`;
    if (type) url += `&type=${type}`;
    const response = await get({
      url,
      data: {
        headers: { Authorization: basicAuth },
      },
    });
    return response;
  } catch (error) {
    logs("error", JSON.stringify(error));
    throw error;
  }
};

module.exports = {
  sendsms,
  getSmsDetails,
};
