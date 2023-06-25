const SenderMasksController = {};
const {
  getSenderMasks,
  createSenderMasks,
  updateSenderMasks,
  deleteSenderMasks,
} = require("../utils");

const logger = require("../lib/loggers");

const logs = (level, message) => {
  logger.log(level, message);
};

//lib
const { get } = require("lodash");
const to = require("await-to-js").default;

SenderMasksController.createSenderMasks = async (req, res, next) => {
  try {
    const [err, sendermasks] = await to(createSenderMasks(req.body));
    if (err) {
      logs("error", `Error on creating sender masks::${err}`);
      return res.status(401).json({
        error: true,
        message: err.message,
      });
    }
    return res.status(200).json(sendermasks);
  } catch (error) {
    logs("error", `Error on creating sender masks::${error}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

SenderMasksController.getAllSenderMasks = async (req, res, next) => {
  try {
    const [err, sendermasks] = await to(
      getSenderMasks(get(req, "query.id", null))
    );
    if (err) {
      logs("error", `Error on fetching sender masks::${err}`);
      return res.status(401).json({
        error: true,
        message: err.message,
      });
    }
    return res.status(200).json(sendermasks);
  } catch (error) {
    logs("error", `Error on fetching sender masks::${err}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

SenderMasksController.updateSenderMasks = async (req, res, next) => {
  try {
    const name = req.body.name;
    const id = req.params.id;
    await to(updateSenderMasks({ name, id }));
    const [err, updatedSenderMasks] = await to(getSenderMasks());
    if (err) {
      logs("error", `Error on updating sender masks::${err}`);
      return res.status(401).json({
        error: true,
        message: err.message,
      });
    }
    return res.status(200).json(updatedSenderMasks);
  } catch (error) {
    logs("error", `Error on updating sender masks::${error}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

SenderMasksController.deleteSenderMasks = async (req, res, next) => {
  try {
    const id = req.params.id;
    await deleteSenderMasks(id);
    const [err, updatedSenderMasks] = await to(getSenderMasks());
    if (err) {
      logs("error", `Error on deleting sender masks::${err}`);
      return res.status(401).json({
        error: true,
        message: err.message,
      });
    }
    return res.status(200).json(updatedSenderMasks);
  } catch (error) {
    logs("error", `Error on deleting sender masks::${err}`);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = SenderMasksController;
