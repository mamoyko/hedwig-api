const { MasterFiles, SplittedFiles } = require("../models");
const { validatePhoneNumber } = require("../lib/validations/blast-validation");
const { getDateString } = require("../lib/date-time");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { get } = require("lodash");
const fs = require("fs");
const logger = require("../lib/loggers");

const logs = (level, message) => {
  logger.log(level, message);
};

const createMasterFileDetails = async (payload) => {
  try {
    return await MasterFiles.create(payload);
  } catch (error) {
    logs(
      "error",
      `Error on creating master file details: ${JSON.stringify(error)}`
    );
    throw error;
  }
};

const createSplittedFile = async (payload) => {
  try {
    return await SplittedFiles.bulkCreate(payload);
  } catch (error) {
    logs(`Error on creating splitted file: ${JSON.stringify(error)}`);
    throw error;
  }
};

const findSplittedFile = async (blast_id) => {
  try {
    return await SplittedFiles.findAll({ where: { blast_id } });
  } catch (error) {
    logs(`Error on getting splitted file: ${JSON.stringify(error)}`);
    throw error;
  }
};

const createFile = async (payload) => {
  try {
    return await SplittedFiles.create(payload);
  } catch (error) {
    logs(`Error on creating splitted file: ${JSON.stringify(error)}`);
    throw error;
  }
};

const parseSplittedFileData = (data, masterFile) => {
  return data.map((item) => {
    let file_path = get(item, "fileWriter.path", null);
    return {
      file_path,
      filename: file_path.replace(/^.*[\\\/]/, ""),
      blast_id: masterFile.blast_id,
      master_file_id: masterFile.id,
    };
  });
};

const getMasterFile = async (blast_id) => {
  try {
    return await MasterFiles.findOne({ where: { blast_id } });
  } catch (error) {
    logs(`Error on getting master file: ${JSON.stringify(error)}`);
    throw error;
  }
};

const blastValidation = async (data) => {
  let invalidNumber = [];
  let validNumber = data.map((item) => {
    if (!validatePhoneNumber(item["field1"]))
      invalidNumber.push(item["field1"]);
    else return item["field1"];
  });

  //removing duplicate number
  validNumber = [...new Set(validNumber)];

  //removing falsy data
  validNumber = validNumber.filter((el) => el);
  return { validNumber, invalidNumber };
};

const fileChunkParser = (data) => {
  return data.reduce((resultArray, phone, index) => {
    const chunkIndex = Math.floor(index / process.env.CHUNK_PER_FILE);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push({ phone });
    return resultArray;
  }, []);
};

const csvWriter = (data, fileName = null) => {
  return data.map((_bulk, index) => {
    let filename = fileName
      ? fileName
      : `batch_${getDateString()}-${index + 1}`;
    let path = `tmp/new-csv-batch/${filename}.csv`;

    //create csv writer
    const _csvWriter = createCsvWriter({
      path,
      header: ["phone"],
    });
    _csvWriter.writeRecords(_bulk).then(() => {
      //do nothing
    });
    return _csvWriter;
  });
};

const deleteFiles = (path) => {
  fs.readdir(path, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(`${path}/${file}`, (_err) => {
        if (_err) {
          logs("error", `Error on deleting files:: ${_err}`);
          throw _err;
        }
        logs("info", `Deleted file:: ${file}`);
      });
    }
  });
};

module.exports = {
  createMasterFileDetails,
  blastValidation,
  fileChunkParser,
  csvWriter,
  parseSplittedFileData,
  createSplittedFile,
  getMasterFile,
  createFile,
  findSplittedFile,
  deleteFiles,
};
