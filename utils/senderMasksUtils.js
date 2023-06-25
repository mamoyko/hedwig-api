const { SenderMasks } = require("../models");

const getSenderMasks = async (id = null) => {
  let sendermasks = null;
  if (id) {
    sendermasks = await SenderMasks.findOne({ where: { id } });
  } else {
    sendermasks = await SenderMasks.findAll();
  }
  return sendermasks;
};

const createSenderMasks = async (payload) => {
  return await SenderMasks.create(payload);
};

const updateSenderMasks = async (payload) => {
  const { name, id } = payload;
  return await SenderMasks.update({ name }, { where: { id } });
};

const deleteSenderMasks = async (id) => {
  return await SenderMasks.destroy({ where: { id } });
};

module.exports = {
  getSenderMasks,
  createSenderMasks,
  updateSenderMasks,
  deleteSenderMasks,
};
