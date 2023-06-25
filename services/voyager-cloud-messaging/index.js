const { sendsms, getSmsDetails } = require("./api");

const vcmSendSMS = async (payload, type = null) => {
  return await sendsms(payload, type);
};

const vcmGetDetails = async (payload) => {
  return await getSmsDetails(payload);
};

module.exports = {
  vcmSendSMS,
  vcmGetDetails,
};
